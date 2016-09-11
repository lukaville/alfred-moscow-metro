#!/usr/bin/python
# -*- coding: utf-8 -*-
import json

from metro.router import Router

SCHEME_METADATA_FILENAME = "scheme-metadata.json"


def calculate():
    scheme_metadata = open(SCHEME_METADATA_FILENAME).read()
    router = Router(json.loads(scheme_metadata))
    print(router.find_routes(1, 217))


if __name__ == '__main__':
    calculate()
