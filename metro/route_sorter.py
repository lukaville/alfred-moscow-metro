from typing import List

from metro.route import Route


def cmp_to_key(mycmp):
    """Convert a cmp= function into a key= function"""

    class K(object):
        def __init__(self, obj, *args):
            self.obj = obj

        def __lt__(self, other):
            return mycmp(self.obj, other.obj) < 0

        def __gt__(self, other):
            return mycmp(self.obj, other.obj) > 0

        def __eq__(self, other):
            return mycmp(self.obj, other.obj) == 0

        def __le__(self, other):
            return mycmp(self.obj, other.obj) <= 0

        def __ge__(self, other):
            return mycmp(self.obj, other.obj) >= 0

        def __ne__(self, other):
            return mycmp(self.obj, other.obj) != 0

    return K


def _cmp_transfers_time(x: Route, y: Route):
    transfers_result = x.get_metrics()['transfers'] - y.get_metrics()['transfers']
    if transfers_result != 0:
        return transfers_result
    else:
        return x.get_metrics()['time'] - y.get_metrics()['time']


def _cmp_time_transfers(x: Route, y: Route):
    time_result = x.get_metrics()['time'] - y.get_metrics()['time']
    if time_result != 0:
        return time_result
    else:
        return x.get_metrics()['transfers'] - y.get_metrics()['transfers']


def _cmp_rounded_time_transfers(x: Route, y: Route):
    rounded_time_x = round(x.get_metrics()['time'] / 60)
    floor_time_x = round(rounded_time_x / 60)

    rounded_time_y = round(y.get_metrics()['time'] / 60)
    floor_time_y = round(rounded_time_y / 60)

    floor_delta = floor_time_x - floor_time_y
    if floor_delta != 0:
        return floor_delta

    rounded_delta = rounded_time_x - rounded_time_y
    if rounded_delta != 0:
        return rounded_delta

    return x.get_metrics()['transfers'] - y.get_metrics()['transfers']


def sort_routes(routes: List[Route], param):
    sort_cmp = {
        'transfers': lambda x, y: x.get_metrics()['transfers'] - y.get_metrics()['transfers'],
        'time': lambda x: x.get_metrics()['time'] - y.get_metrics()['time'],
        'transfersTime': _cmp_transfers_time,
        'timeTransfers': _cmp_time_transfers,
        'roundedTimeTransfers': _cmp_rounded_time_transfers
    }[param]
    return sorted(routes, key=cmp_to_key(sort_cmp))
