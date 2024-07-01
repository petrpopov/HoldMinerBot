import json
import base64
import math
import subprocess
import asyncio
import time
import dateutil.parser
from pathlib import Path
import pandas as pd
from urllib.parse import quote, unquote
from os import listdir
from os.path import isfile, join
from typing import Any, Tuple, Optional, Dict, List

import aiohttp
from aiohttp_proxy import ProxyConnector
from better_proxy import Proxy
from pyrogram import Client
from pyrogram.errors import Unauthorized, UserDeactivated, AuthKeyUnregistered
from pyrogram.raw.functions.messages import RequestWebView

from bot.utils import logger
from bot.exceptions import InvalidSession
from .headers import headers
from bot.config import settings


class Miner:
    def __init__(self, tg_client: Client):
        self.session_name = tg_client.name
        self.tg_client = tg_client

        self.speed_levels = {
            '1': 0.02,
            '2': 0.03,
            '3': 0.04,
            '4': 0.05,
            '5': 0.06,
            '6': 0.1
        }

        self.speed_upgrades = {
            '2': 0.2,
            '3': 1.0,
            '4': 2.0,
            '5': 5.0,
            '6': 15.0
        }

        self.storage_levels = {
            '1': 2,
            '2': 3,
            '3': 4,
            '4': 6,
            '5': 12,
            '6': 24
        }

        self.storage_upgrades = {
            '2': 0.2,
            '3': 0.5,
            '4': 1.0,
            '5': 5.0,
            '6': 10
        }

    async def get_tg_web_data(self, proxy: str | None) -> Tuple[str, int]:
        try:
            if proxy:
                proxy = Proxy.from_str(proxy)
                proxy_dict = dict(
                    scheme=proxy.protocol,
                    hostname=proxy.host,
                    port=proxy.port,
                    username=proxy.login,
                    password=proxy.password
                )
            else:
                proxy_dict = None

            self.tg_client.proxy = proxy_dict

            if not self.tg_client.is_connected:
                try:
                    await self.tg_client.connect()
                except (Unauthorized, UserDeactivated, AuthKeyUnregistered):
                    raise InvalidSession(self.session_name)

            web_view = await self.tg_client.invoke(RequestWebView(
                peer=await self.tg_client.resolve_peer('holdwallet_bot'),
                bot=await self.tg_client.resolve_peer('holdwallet_bot'),
                platform='android',
                from_bot_menu=False,
                url='https://tg.holdwallet.app/'
            ))

            auth_url = web_view.url
            tg_web_data = unquote(
                string=unquote(
                    string=auth_url.split('tgWebAppData=', maxsplit=1)[1].split('&tgWebAppVersion', maxsplit=1)[0]))

            params = ['user', 'auth_date', 'hash']
            res = {}
            for param in tg_web_data.split('&'):
                val = param.split('=')
                param_name = val[0]
                if param_name in params:
                    res[param_name] = quote(val[1])

            tg_res = f"user={res['user']}&chat_instance=-3838126684000770555&chat_type=sender&auth_date={res['auth_date']}&hash={res['hash']}"

            username = self.session_name[5:]
            user_peer_id = await self.tg_client.resolve_peer(username)
            user_id = int(user_peer_id.user_id)

            if self.tg_client.is_connected:
                await self.tg_client.disconnect()

            return tg_res, user_id

        except InvalidSession as error:
            raise error

        except Exception as error:
            logger.error(f"{self.session_name} | Unknown error during Authorization: {error}")
            await asyncio.sleep(delay=7)

    async def check_proxy(self, http_client: aiohttp.ClientSession, proxy: Proxy) -> None:
        try:
            response = await http_client.get(url='https://httpbin.org/ip', timeout=aiohttp.ClientTimeout(5))
            ip = (await response.json()).get('origin')
            logger.info(f"{self.session_name} | Proxy IP: {ip}")
        except Exception as error:
            logger.error(f"{self.session_name} | Proxy: {proxy} | Error: {error}")

    # todo: not fucking working
    # async def login(self, http_client: aiohttp.ClientSession, tg_web_data: str, address: str, signature: str) -> str:
    #     try:
    #         response = await http_client.post(
    #             url='https://tg.holdwallet.app/api/auth/login',
    #             json={
    #                 "walletAddress": address,
    #                 "signature": signature,
    #                 "initData": tg_web_data
    #             })
    #         response.raise_for_status()
    #
    #         response_json = await response.json()
    #         access_token = response_json['metadata']['accessToken']
    #
    #         return access_token
    #     except Exception as error:
    #         logger.error(f"{self.session_name} | Unknown error while getting Access Token: {error}")
    #         await asyncio.sleep(delay=7)

    def get_seed_phrase(self) -> Optional[str]:
        username = self.session_name[5:]
        filename = 'accounts_hold.xlsx'
        file = Path(filename)
        if not file.exists():
            return None

        df = pd.read_excel(filename)
        res = []
        for i in range(len(df.index)):
            res_dict = df.iloc[i].to_dict()
            res.append(res_dict)

        for account in res:
            if account.get('username') and account.get('username').lower() == username.lower():
                return account.get('seed_phrase')
        return None

    def get_address_and_signature(self, user_id: int) -> Tuple[str, str]:
        seed_phrase = self.get_seed_phrase()
        if not seed_phrase:
            raise Exception(f"Seed phrase not found for {self.session_name}")

        res = subprocess.run(['node', 'sign/sign.js', seed_phrase, str(user_id)], stdout=subprocess.PIPE).stdout.decode('utf-8')
        rows = res.split('\n')

        address = rows[0]
        address = address[len('Address: '):].strip()

        signature = rows[1]
        signature = signature[len('Signature: '):].strip()
        return address, signature

    def get_token_and_expire_date(self) -> Tuple[Optional[str], Optional[int]]:
        username = self.session_name[5:]
        onlyfiles = [f for f in listdir('hold_tokens') if isfile(join('hold_tokens', f))]

        filename = None
        for file in onlyfiles:
            if username.lower() in file.lower():
                filename = file
                break

        if filename is None:
            raise Exception(f"Not found access token for {self.session_name}")

        filename = f"hold_tokens/{filename}"
        with open(filename, 'r') as file:
            access_token = file.read().replace('\n', '')
            parts = access_token.split(".")
            main_part = parts[1]
            if main_part[-2] != '==':
                main_part += '=='
            main_part = base64.b64decode(main_part)
            main_part = main_part.decode('utf-8')
            main_part_dict = json.loads(main_part)
            expiration = int(main_part_dict['exp'])
            return access_token, expiration

    async def balance(self, http_client: aiohttp.ClientSession) -> Dict[str, Any]:
        try:
            response = await http_client.get(
                url='https://tg.holdwallet.app/api/user/balance',
                json={})
            response.raise_for_status()

            response_json = await response.json()
            balance_info = response_json

            return balance_info
        except Exception as error:
            logger.error(f"{self.session_name} | Unknown error while getting balance: {error}")
            await asyncio.sleep(delay=7)

    async def last_claim(self, http_client: aiohttp.ClientSession) -> Dict[str, Any]:
        try:
            response = await http_client.get(
                url='https://tg.holdwallet.app/api/transaction/last-claim',
                json={})
            response.raise_for_status()

            response_json = await response.json()
            claim_info = response_json

            return claim_info
        except Exception as error:
            logger.error(f"{self.session_name} | Unknown error while getting last claim: {error}")
            await asyncio.sleep(delay=7)

    async def me(self, http_client: aiohttp.ClientSession) -> Dict[str, Any]:
        try:
            response = await http_client.get(
                url='https://tg.holdwallet.app/api/user/me',
                json={})
            response.raise_for_status()

            response_json = await response.json()
            me_info = response_json

            return me_info
        except Exception as error:
            logger.error(f"{self.session_name} | Unknown error while getting account info (me_info): {error}")
            await asyncio.sleep(delay=7)

    async def claim(self, http_client: aiohttp.ClientSession) -> Dict[str, Any]:
        try:
            response = await http_client.post(
                url='https://tg.holdwallet.app/api/user/claim',
                json={})
            response.raise_for_status()

            response_json = await response.json()
            claim_info = response_json

            return claim_info
        except Exception as error:
            logger.error(f"{self.session_name} | Unknown error while claiming: {error}")
            await asyncio.sleep(delay=7)

    def is_claim_possible(self, claim_info: Dict[str, Any], me_info: Dict[str, Any]) -> bool:
        last_claim_timestamp = dateutil.parser.parse(claim_info['metadata']['createdAt']).timestamp()
        storage_hours = int(me_info['metadata']['mining']['storage'])
        next_claim_timestamp = last_claim_timestamp + storage_hours * 3600

        if time.time() >= next_claim_timestamp:
            return True

        percent = 100 * (time.time() - last_claim_timestamp) / (storage_hours * 3600)
        if percent >= settings.CLAIM_MIN_PERCENT:
            return True
        return False

    def get_next_claim_sleep_time(self, claim_info: Dict[str, Any], me_info: Dict[str, Any]) -> int:
        last_claim_timestamp = dateutil.parser.parse(claim_info['metadata']['createdAt']).timestamp()
        storage_hours = int(me_info['metadata']['mining']['storage'])
        next_claim_timestamp = last_claim_timestamp + storage_hours * 3600

        return math.ceil(next_claim_timestamp - time.time())

    async def upgrade_speed(self, http_client: aiohttp.ClientSession) -> Dict[str, Any]:
        try:
            response = await http_client.post(
                url='https://tg.holdwallet.app/api/user/upgrade',
                json={
                    "type": "speed"
                })
            response.raise_for_status()

            response_json = await response.json()
            upgrade_info = response_json

            return upgrade_info
        except Exception as error:
            logger.error(f"{self.session_name} | Unknown error while upgrading speed: {error}")
            await asyncio.sleep(delay=7)

    async def upgrade_speed_if_possible(self, http_client: aiohttp.ClientSession, me_info: Dict[str, Any], balance: float) -> bool:
        speed = float(me_info['metadata']['mining']['speed'])
        speed_level = -1
        for k in list(self.speed_levels.keys()):
            if self.speed_levels[k] == speed:
                speed_level = int(k)
                break

        if speed_level < 0:
            return False

        next_speed_level = speed_level + 1
        if settings.SPEED_MAX_LEVEL >= next_speed_level:
            skey = str(next_speed_level)
            if skey in self.speed_upgrades:
                upgrade_price = self.speed_upgrades[skey]

                if balance >= upgrade_price:
                    logger.info(f"f{self.session_name} | Speed upgrade is possible, upgrading")
                    upgrade_info = await self.upgrade_speed(http_client=http_client)
                    if upgrade_info and 'successfully' in upgrade_info['message'].lower().strip():
                        return True
                    if upgrade_info and upgrade_info['statusCode'] == 400:
                        logger.error(f"{self.session_name} | Speed upgraded unsuccessfully with error: <c>{upgrade_info['message']}</c>")
                        return False
        return False

    async def upgrade_storage(self, http_client: aiohttp.ClientSession) -> Dict[str, Any]:
        try:
            response = await http_client.post(
                url='https://tg.holdwallet.app/api/user/upgrade',
                json={
                    "type": "storage"
                })
            response.raise_for_status()

            response_json = await response.json()
            upgrade_info = response_json

            return upgrade_info
        except Exception as error:
            logger.error(f"{self.session_name} | Unknown error while upgrading storage: {error}")
            await asyncio.sleep(delay=7)

    async def upgrade_storage_if_possible(self, http_client: aiohttp.ClientSession, me_info: Dict[str, Any], balance: float) -> bool:
        storage = float(me_info['metadata']['mining']['storage'])
        storage_level = -1
        for k in list(self.storage_levels.keys()):
            if self.storage_levels[k] == storage:
                storage_level = int(k)
                break

        if storage_level < 0:
            return False

        next_storage_level = storage_level + 1
        if settings.STORAGE_MAX_LEVEL >= next_storage_level:
            skey = str(next_storage_level)
            if skey in self.storage_upgrades:
                upgrade_price = self.storage_upgrades[skey]

                if balance >= upgrade_price:
                    logger.info(f"f{self.session_name} | Storage upgrade is possible, upgrading")
                    upgrade_info = await self.upgrade_storage(http_client=http_client)
                    if upgrade_info and 'successfully' in upgrade_info['message'].lower().strip():
                        return True
                    if upgrade_info and upgrade_info['statusCode'] == 400:
                        logger.error(f"{self.session_name} | Storage upgraded unsuccessfully with error: <c>{upgrade_info['message']}</c>")
                        return False
        return False

    async def run(self, proxy: str | None) -> None:
        access_token = None
        sleep_time = settings.DEFAULT_SLEEP
        proxy_conn = ProxyConnector().from_url(proxy) if proxy else None

        async with (aiohttp.ClientSession(headers=headers, connector=proxy_conn) as http_client):
            if proxy:
                await self.check_proxy(http_client=http_client, proxy=proxy)

            while True:
                try:
                    if not access_token:
                        tg_web_data, user_id = await self.get_tg_web_data(proxy=proxy)
                        # address, signature = self.get_address_and_signature(user_id)

                        access_token, exp = self.get_token_and_expire_date()

                        http_client.headers["Authorization"] = f"Bearer {access_token}"
                        headers["Authorization"] = f"Bearer {access_token}"

                    if exp <= time.time():
                        logger.error(f"{self.session_name} | Access token expired")
                    else:
                        balance_info = await self.balance(http_client=http_client)
                        if balance_info:
                            balance = float(balance_info['metadata'])
                            logger.info(f"{self.session_name} | Balance is <c>{balance: .6f}</c>")

                        claim_info = await self.last_claim(http_client=http_client)
                        me_info = await self.me(http_client=http_client)
                        claim_possible = self.is_claim_possible(claim_info=claim_info, me_info=me_info)
                        if claim_possible:
                            claimed_info = await self.claim(http_client=http_client)
                            balance_info = await self.balance(http_client=http_client)
                            if claimed_info is not None and balance_info is not None:
                                balance = float(balance_info['metadata'])
                                logger.success(f"{self.session_name} | Claimed successfully, new balance is <c>{balance}</c>")

                                claim_info = await self.last_claim(http_client=http_client)
                                me_info = await self.me(http_client=http_client)

                        upgrade_speed_res = await self.upgrade_speed_if_possible(http_client=http_client, me_info=me_info, balance=balance)
                        if upgrade_speed_res:
                            balance_info = await self.balance(http_client=http_client)
                            balance = float(balance_info['metadata'])
                            logger.success(f"{self.session_name} | Speed upgraded successfully, new balance is <c>{balance}</c>")

                            me_info = await self.me(http_client=http_client)
                        else:
                            logger.info(f"{self.session_name} | Speed not upgraded")

                        upgrade_storage_res = await self.upgrade_storage_if_possible(http_client=http_client, me_info=me_info, balance=balance)
                        if upgrade_storage_res:
                            balance_info = await self.balance(http_client=http_client)
                            balance = float(balance_info['metadata'])
                            logger.success(f"{self.session_name} | Storage upgraded successfully, new balance is <c>{balance}</c>")

                            me_info = await self.me(http_client=http_client)
                        else:
                            logger.info(f"{self.session_name} | Storage not upgraded")

                        sleep_time = self.get_next_claim_sleep_time(claim_info, me_info)
                        if sleep_time <= 0:
                            sleep_time = settings.DEFAULT_SLEEP

                except InvalidSession as error:
                    raise error

                except Exception as error:
                    logger.error(f"{self.session_name} | Unknown error: {error}")
                    await asyncio.sleep(delay=7)

                else:
                    logger.info(f"{self.session_name} | Sleeping for the next claim {sleep_time}s")
                    await asyncio.sleep(delay=sleep_time)


async def run_miner(tg_client: Client, proxy: str | None):
    try:
        await Miner(tg_client=tg_client).run(proxy=proxy)
    except InvalidSession:
        logger.error(f"{tg_client.name} | Invalid Session")