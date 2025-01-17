import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import Link from "next/link";

export default function Home() {
  const completedMatches = [
    {
      tournament: "Asia Cup 2023",
      match: "4th Match, ODI",
      teams: ["Bangladesh", "Afghanistan"],
      scores: ["334-5 (50)", "230 (34.2)"],
      result: "Bangladesh won by 104 runs",
      status: "Completed",
    },
    {
      tournament: "IPL 2023",
      match: "18th Match, T20",
      teams: ["MI", "RCB"],
      scores: ["186-7 (20)", "188-3 (19.3)"],
      result: "RCB won by 7 wickets",
      status: "Completed",
    },
    {
      tournament: "IPL 2023",
      match: "19th Match, T20",
      teams: ["DC", "KKR"],
      scores: ["196-8 (20)", "176-10 (18.2)"],
      result: "Delhi Capitals won by 2 runs",
      status: "Completed",
    },
  ];

  const upcomingMatches = [
    {
      tournament: "Asia Cup 2023",
      match: "5th Match, ODI",
      teams: ["India", "Nepal"],
      time: "04 SEP, 2023, MON",
      location: "Pallekele, Sri Lanka",
      startTime: "03:30 PM",
    },
    {
      tournament: "Asia Cup 2023",
      match: "6th Match, ODI",
      teams: ["Afghanistan", "Sri Lanka"],
      time: "05 SEP, 2023, TUE",
      location: "Lahore, Pakistan",
      startTime: "03:30 PM",
    },
    {
      tournament: "NZ Tour of Eng",
      match: "4th Match, T20",
      teams: ["England", "New Zealand"],
      time: "05 SEP, 2023, TUE",
      location: "Nottingham, England",
      startTime: "11:00 PM",
    },
    {
      tournament: "Asia Cup 2023",
      match: "7th Match, ODI",
      teams: ["Pakistan", "B2"],
      time: "06 SEP, 2023, WED",
      location: "Lahore, Pakistan",
      startTime: "03:30 PM",
    },
  ];

  const liveMatches = [
    {
      tournament: "Asia Cup 2023",
      match: "4th Match, ODI",
      teams: ["Bangladesh", "Afghanistan"],
      scores: ["151-2 (28.3)", "Yet to bat"],
      status: "Bangladesh opt to bat",
      live: true,
      crr: "5.3",
    },
    {
      tournament: "IPL 2023",
      match: "18th Match, T20",
      teams: ["MI", "RCB"],
      scores: ["186-7 (20.0)", "150-3 (15.4)"],
      status: "RCB needs 36 of 14 balls",
      live: true,
      crr: "9.70",
    },
    {
      tournament: "IPL 2023",
      match: "19th Match, T20",
      teams: ["DC", "KKR"],
      scores: ["30-1 (4.2)", "Yet to bat"],
      status: "Delhi Capitals opt to bat",
      live: true,
      crr: "7.14",
    },
  ];

  return (
    <div className="container mx-auto px-[10%] py-8">
      {/* Tabs */}
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="flex justify-around bg-gradient-to-r from-blue-500 to-purple-500 p-7 rounded-full">
          <TabsTrigger
            value="live"
            className="text-white font-medium px-4 py-2 transition duration-300  hover:bg-none active:font-bold focus:font-bold focus:text-lg focus:font-mono"
          >
            Live
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="text-white font-medium px-4 py-2 transition duration-300  hover:bg-none  focus:font-bold focus:text-lg focus:font-mono"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="text-white font-medium px-4 py-2 transition duration-300  hover:bg-none  focus:font-bold focus:text-lg focus:font-mono"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Live Matches */}
        <TabsContent value="live">
          <div className="flex flex-col gap-6 mt-6">
            {liveMatches.map((match, index) => (
              <Link href={`/All-Matches/${match.match}`} key={index}>
                <Card className="text-center  bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold">
                      {match.tournament} • {match.match}
                    </CardTitle>
                    <p className="text-xs text-gray-400">{match.status}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">
                            {match.teams[0]}
                          </span>{" "}
                          <span className="text-gray-400">
                            {match.scores[0]}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">
                            {match.teams[1]}
                          </span>{" "}
                          <span className="text-gray-400">
                            {match.scores[1]}
                          </span>
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-blue-400 text-right">
                        Current Run Rate: {match.crr}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Upcoming Matches */}
        <TabsContent value="upcoming">
          <div className="space-y-6 mt-6">
            {upcomingMatches.map((match, index) => (
              <Card
                key={index}
                className="text-center bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-sm font-bold">
                    {match.tournament} • {match.match}
                  </CardTitle>
                  <p className="text-xs text-gray-400">Upcoming</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    {/* Teams and Match Info */}
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">{match.teams[0]}</span>{" "}
                        <span className="text-gray-400">vs</span>{" "}
                        <span className="font-semibold">{match.teams[1]}</span>
                      </p>
                      <p className="text-sm text-gray-400">{match.time}</p>
                      <p className="text-sm text-gray-400">{match.location}</p>
                    </div>
                    {/* Match Start Time */}
                    <p className="text-sm font-semibold text-purple-400 text-right">
                      {match.startTime}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed Matches */}
        <TabsContent value="completed">
          <div className="space-y-6 mt-6">
            {completedMatches.map((match, index) => (
              <Card
                key={index}
                className="text-center bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-sm font-bold">
                    {match.tournament} • {match.match}
                  </CardTitle>
                  <p className="text-xs text-gray-400">{match.status}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    {/* Teams and Scores */}
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">{match.teams[0]}</span>{" "}
                        <span className="text-gray-400">{match.scores[0]}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">{match.teams[1]}</span>{" "}
                        <span className="text-gray-400">{match.scores[1]}</span>
                      </p>
                    </div>
                    {/* Match Result */}
                    <p className="text-sm font-semibold text-green-400 text-right">
                      {match.result}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
