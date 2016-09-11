#!/usr/local/bin/python3
# -*- coding: utf-8 -*-
import codecs
import json
import sys

import math

from metro.metro import Metro

SCHEME_METADATA_FILENAME = 'scheme-metadata.json'


def find_routes(route_to):
    with codecs.open(SCHEME_METADATA_FILENAME, 'r', encoding='utf8') as f:
        scheme_metadata = f.read()
        metro = Metro(json.loads(scheme_metadata))
        from_station = metro.find_stations('изм')[0]

        result_routes = []
        for to_station in metro.find_stations(route_to):
            route = metro.find_routes(from_station, to_station)[0]
            result_routes.append(route)

        return result_routes


if __name__ == '__main__':
    routes = find_routes(sys.argv[1])

    result = {
        'items': []
    }

    for route in routes:
        result['items'].append({
            'title': route.get_stations()[0].name + ' → ' + route.get_stations()[-1].name,
            'subtitle': str(math.ceil(route._metrics['time'] / 60)) + ' мин.'
        })

    print(json.dumps(result))
