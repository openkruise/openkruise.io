# Game MatchMaking

Session-based games usually require `matchmaking service`, which allow players to find suitable teammates and opponents to form a match, and allocates suitable game server for the match. After thar, players can enter the game with address of the game server.

OKG supports the cloud-native game matching framework [Open Match](https://github.com/googleforgames/open-match),
and the [kruise-game-open-match-director](https://github.com/CloudNativeGame/kruise-game-open-match-director) component is built based on that,
which can allocates game servers addresses to players in matches.

## Introduction

- `OpenKruiseGame`, `Open Match` and `kruise-game-open-match-director` need to be installed in the Kubernetes cluster.
- The game servers managed by GameServerSet and to be matched needs to configure the Network field. For details, please refer to [Network Documentation](./network.md).
- kruise-game-open-match-director will select a game server whose network is Ready and OpsState is None, obtain the corresponding network connection information, and distribute it to Tickets in a Match.
- kruise-game-open-match-director marks the OpsState field to the allocated GameServer as Allocated. After that, the GameServer will not be allocated again, and the priority of horizontal scaling-down of the GS is low to avoid being easily deleted. For the specific scaling order of the game server, please refer to [Game Servers Scale Document](./gameservers-scale.md).
- kruise-game-open-match-director For more functions, please refer to [GitHub](https://github.com/CloudNativeGame/kruise-game-open-match-director).
- For more examples of OKG + Open Match, please refer to [GitHub](https://github.com/CloudNativeGame/kruise-game-open-match-example).