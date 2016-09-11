from typing import Dict, List

from metro.route_sorter import sort_routes


def check_for_direct_route(args):
    def route_filter(routes):
        routes = sort_routes(routes, 'transferTime')
        if routes[0].get_metrics()['transfers'] == 0:
            return [routes[0]]
        else:
            return routes

    return route_filter


def fastest_routes(args):
    return lambda routes: sort_routes(routes, 'timeTransfers')


def remove_double_transfer_routes(args):
    def route_filter(routes):
        return routes

    return route_filter


FILTERS = {'CheckForDirectRoute': check_for_direct_route,
           'FastestRoutes': fastest_routes,
           'LeastAmountOfTransfers': check_for_direct_route,
           'RemoveRedundantRoutes': remove_double_transfer_routes,
           'RemoveDoubleTransferRoutes': check_for_direct_route,
           'Genarcho': check_for_direct_route,
           'TransferPenaltySort': check_for_direct_route,
           'TrimResults': check_for_direct_route}


class Filter(object):
    def __init__(self, filter_configs: List[Dict]):
        self.filters = []
        for filter_config in filter_configs:
            self.filters.append(
                FILTERS[filter_config['name']](filter_config.get('args'))
            )

    def process(self, routes):
        result = []
        for route_filter in self.filters:
            if len(result) < 2:
                return result
            result = route_filter(result)
        return routes
