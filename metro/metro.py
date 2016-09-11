from metro.line import Line
from metro.link import Link
from metro.router import Router
from metro.station import Station


class Metro(object):
    def __init__(self, scheme_metadata):
        self.router = Router()

        self.lines = {}
        for line_id, line_json in scheme_metadata['lines'].items():
            line = Line(line_json)
            line.set_id(int(line_id))
            self.lines[line.id] = line

        self.stations = {}
        for station_id, station_json in scheme_metadata['stations'].items():
            station = Station(station_json)
            station.set_id(int(station_id))
            station.set_line(self.lines[station.line_id])
            self.stations[station.id] = station

        self.links = {}
        for link_id, link_json in scheme_metadata['links'].items():
            link = Link(link_json)
            link.set_id(int(link_id))
            link.set_from_station(self.stations[link.from_station_id])
            link.set_to_station(self.stations[link.to_station_id])
            self.links[link.id] = link

        for station in self.stations.values():
            links = [self.links[link_id] for link_id in station.link_ids]
            station.set_links(links)

    def get_stations(self):
        return self.stations.values()

    def find_stations(self, name):
        stations = self.stations.values()
        return [station for station in stations if station.name.lower().startswith(name.lower())]

    def find_routes(self, station_from: Station, station_to: Station):
        return self.router.find_routes(station_from, station_to)
