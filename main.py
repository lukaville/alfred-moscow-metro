#!/usr/bin/python
# -*- coding: utf-8 -*-
import codecs
import json

from metro.metro import Metro

SCHEME_METADATA_FILENAME = 'scheme-metadata.json'


def calculate():
    with codecs.open(SCHEME_METADATA_FILENAME, 'r', encoding='utf8') as f:
        scheme_metadata = f.read()
        metro = Metro(json.loads(scheme_metadata))
        from_station = metro.find_station('изм')
        to_station = metro.find_station('аэропорт')

        routes = metro.find_routes(from_station, to_station)
        for route in routes:
            print(route.__str__())


if __name__ == '__main__':
    calculate()
