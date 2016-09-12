#!/usr/local/bin/python3
# -*- coding: utf-8 -*-
import codecs
import datetime
import json
import sys
import humanize

from alfred.alfred import WorkFlowOptions
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


def route_to_option(route):
    human_time = humanize.naturaldelta(datetime.timedelta(seconds=route.get_metrics()['time']))
    url = 'https://metro.yandex.ru/moscow?from={}&to={}&route=0'

    return {
        'title': route.get_from_station().name + ' → ' + route.get_to_station().name,
        'subtitle': human_time,
        'arg': url.format(route.get_from_station().id, route.get_to_station().id)
    }


if __name__ == '__main__':
    routes = find_routes(sys.argv[1])

    options = WorkFlowOptions()

    for route in routes:
        options.add_option(route_to_option(route))

    options.print()
