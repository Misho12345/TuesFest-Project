using Microsoft.AspNetCore.SignalR;

namespace Server.Hubs
{
    public class Player
    {
        public string Username;
        public string GroupName;
        public double X;
        public double Y;

        public Player(string username, string groupName)
        {
            Username = username;
            GroupName = groupName;
            X = 0;
            Y = 0;
        }
    }

    public class UserHub : Hub
    {
        private static Dictionary<string, Player> players = new();

        public async Task RegisterUser(string username, string groupName)
        {
            var player = new Player(username, groupName);
            players.Add(Context.ConnectionId, player);
            
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("PlayerJoined", player.Username);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (players.Remove(Context.ConnectionId, out var player))
                await Clients.Group(player.GroupName).SendAsync("PlayerLeft", player.Username);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {
            if (players.TryGetValue(Context.ConnectionId, out var player))
                await Clients.Group(player.GroupName)
	                .SendAsync("ReceiveMessage", player.Username, message);
        }

        public async Task MovePlayer(double x, double y)
        {
            //if (x * x + y * y > 10) return;

	        if (players.TryGetValue(Context.ConnectionId, out var player))
	        {
		        player.X += x; 
		        player.Y += y;
		        await Clients.OthersInGroup(player.GroupName)
			        .SendAsync("SetPlayerPosition", player.Username, x, y);
	        }
		}

        public async Task GetPlayerPositions()
        {
			if (players.TryGetValue(Context.ConnectionId, out var player))
			{
				var positions = new List<double>();
                var names = new List<string>();

				foreach (var pair in players.Where(pair => pair.Value.GroupName == player.GroupName && 
				                                           pair.Value.Username != player.Username))
				{
					positions.Add(pair.Value.X);
					positions.Add(pair.Value.Y);
					names.Add(pair.Value.Username);
				}

				await Clients.Caller.SendAsync("ReceivePlayerPositions", positions, names);
			}
        }
    }
}
