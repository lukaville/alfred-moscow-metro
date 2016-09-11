# Ported to Python from
# https://yastatic.net/metro/2.3.53/build/index/_index.ru.js
import copy

import math

from metro.filter import Filter
from metro.route import Route
from metro.station import Station

INFINITY = math.inf


class Router(object):
    def __init__(self):
        self.transfer_tolerance_count = 1
        self.hop_tolerance_ratio = 2
        self.time_tolerance_ratio = 2
        self.line_graph_max_depth = 3

        self.filter_config = [{
            'name': 'CheckForDirectRoute'
        }, {
            'name': 'RemoveDoubleTransferRoutes'
        }, {
            'name': 'Genarcho',
            'args': {
                'timeToleranceRatio': 1.2,
                'transferToleranceCount': 1
            }
        }]

        self._optimal = {'time': INFINITY}
        self._limit = {'time': INFINITY, 'transfers': 0, 'hops': 0}
        self._curr_route_id = 0
        self._filter = Filter(self.filter_config)

    def reset_limits(self):
        self._optimal['time'] = INFINITY,
        self._optimal['transfers'] = self.line_graph_max_depth + self.transfer_tolerance_count,
        self._optimal['hops'] = INFINITY,
        self._limit['time'] = INFINITY,
        self._limit['transfers'] = self.line_graph_max_depth + self.transfer_tolerance_count,
        self._limit['hops'] = INFINITY

    def is_within_limits(self, metrics):
        return metrics['transfers'] <= self._limit['transfers'] and \
               metrics['time'] <= self._optimal['time'] or \
               metrics['transfers'] <= self._optimal['transfers'] and \
               metrics['time'] <= self._limit['time'] or \
               metrics['transfers'] <= self._limit['transfers'] and \
               metrics['hops'] <= self._optimal['hops']

    def update_limits(self, metrics):
        if metrics['transfers'] < self._optimal['transfers']:
            self._optimal['transfers'] = metrics['transfers']

        if self._optimal['transfers'] == 0:
            self._limit['transfers'] = 0

        if metrics['time'] < self._optimal['time']:
            self._optimal['time'] = metrics['time']

        if metrics['hops'] < self._optimal['hops']:
            self._optimal['hops'] = metrics['hops']

        self._limit['time'] = self._optimal['time'] * self.time_tolerance_ratio
        self._limit['hops'] = self._optimal['hops'] * self.hop_tolerance_ratio

    def recursive_routing_call(self, station_from: Station, station_to: Station, route: Route = None):
        routes = []

        if route is None:
            route = Route()
        route.add_station(station_from)

        if self.is_within_limits(route.get_metrics()):
            if station_from.id == station_to.id:
                route.id = self._curr_route_id
                self._curr_route_id += 1
                routes.append(route)
            else:
                for link in station_from.links:
                    opposite = link.get_opposite_station(station_from)
                    if not (opposite.is_fully_closed() or route.is_station_visited(opposite)):
                        r = copy.deepcopy(route)
                        r.go_through_link(link)

                        result = self.recursive_routing_call(opposite, station_to, r)
                        if len(result) > 0:
                            routes += result
        return routes

    def find_routes(self, station_from: Station, station_to: Station):
        self.reset_limits()
        return self._filter.process(self.recursive_routing_call(
            station_from, station_to
        ))
