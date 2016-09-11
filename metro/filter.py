from typing import Dict, List

from metro.route_sorter import sort_routes


def check_for_direct_route(args):
    def route_filter(routes):
        routes = sort_routes(routes, 'transfersTime')
        if routes[0].get_metrics()['transfers'] == 0:
            return [routes[0]]
        else:
            return routes

    return route_filter


def fastest_routes(args):
    return lambda routes: sort_routes(routes, 'timeTransfers')


def remove_double_transfer_routes(args):
    def route_filter(routes):
        results = []

        for route in routes:
            if route.get_metrics()['transfers'] < 2:
                results.append(route)
                continue

            station_id = route.get_stations()[0].id
            station_line_id = route.get_stations()[0].line.id
            visited_station_ids = []

            def check(station, visited):
                line_id = station.line.id
                if line_id != station_line_id:
                    visited.append(station_id)
                    if len(visited) > 1:
                        return all(link.from_station.id != visited and \
                                   link.to_station.id != visited[0] \
                                   for link in station.links)
                else:
                    if len(visited) > 0:
                        visited.clear()

            if all(check(station, visited_station_ids) for station in route.get_stations()):
                results.append(route)

        return results

    return route_filter


def genarcho(args):
    def route_filter(routes):
        time_transfers_sorted = sort_routes(routes, 'timeTransfers')
        transfers_time_sorted = sort_routes(routes, 'transfersTime')

        route_ids = [time_transfers_sorted[0].id, transfers_time_sorted[0].id]
        time_tolerance = time_transfers_sorted[0].get_metrics()['time'] * args['timeToleranceRatio']
        transfer_tolerance = time_transfers_sorted[0].get_metrics()['transfers'] + args['transferToleranceCount']

        for route in time_transfers_sorted:
            if route.id != time_transfers_sorted[0].id and \
                            route.id != transfers_time_sorted[0].id and \
                            route.get_metrics()['time'] <= time_tolerance and \
                            route.get_metrics()['transfers'] <= transfer_tolerance:
                route_ids.append(route.get_id())
                break

        visited_ids = set()
        result_routes = []

        for route_id in route_ids:
            if route_id not in visited_ids:
                founded_route = next(route for route in routes if route.id == route_id)
                if founded_route is not None:
                    result_routes.append(founded_route)
                    visited_ids.add(route_id)

        return sort_routes(result_routes, 'roundedTimeTransfers')

    return route_filter


FILTERS = {'CheckForDirectRoute': check_for_direct_route,
           'FastestRoutes': fastest_routes,
           'LeastAmountOfTransfers': check_for_direct_route,
           'RemoveRedundantRoutes': check_for_direct_route,
           'RemoveDoubleTransferRoutes': remove_double_transfer_routes,
           'Genarcho': genarcho,
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
        result = routes
        for route_filter in self.filters:
            if len(result) < 2:
                return result
            result = route_filter(result)
        return result
