Parse.Cloud.define("hello", (req) => {
  req.log.info(req);
  return "Hi from Parse Server";
});

Parse.Cloud.define("OnlineAgentByAgentCode", async (request) => {
  let AgentCode = request.params.AgentCode;

  let returnCode = 0;
  //------------------

  const query = new Parse.Query("OnlineAgentLists"); // select * from OnlineAgentLists

  query.equalTo("AgentCode", AgentCode); // where AgentCode = request.params.AgentCode

  //console.log("Agent Name: "+request.params.AgentName);

  let results;

  try {
    results = await query.first();

    if (results == undefined) {
      returnCode = "9";
    } else {
      returnCode = results.get("AgentStatus");
    }

    return returnCode;
  } catch (error) {
    throw error.message;
  }
});

Parse.Cloud.define("postOnlineAgentListByTeam", async (request) => {
  /*
    Parameter:
            AgentCode: AgentCode,
            AgentName: AgentName,
            Queue: Queue,
            AgentStatus: AgentStatus,
            AgentStatusCode: AgentStatusCode,
            IsLogin: IsLogin
    */
  let AgentCode = request.params.AgentCode;
  let AgentName = request.params.AgentName;
  let Queue = request.params.Queue;
  let AgentStatus = request.params.AgentStatus;
  let AgentStatusCode = request.params.AgentStatusCode;
  let IsLogin = request.params.IsLogin;
  let startedAt = new Date();

  let QueueInt = 0;

  if (Queue != undefined) QueueInt = parseInt(Queue); //long

  let Teams = [
    "Team0",
    "Team1",
    "Team2",
    "Team3",
    "Team4",
    "Team5",
    "Team6",
    "Team7",
    "Team8",
    "Team9",
  ];
  let QueueText = Teams[QueueInt];

  let returnCode = 0;
  //------------------
  console.log("AgentCode: " + AgentCode);
  console.log("AgentName: " + AgentName);
  console.log("QueueText: " + QueueText);
  console.log("AgentStatus: " + AgentStatus);
  console.log("AgentStatusCode: " + AgentStatusCode);
  console.log("IsLogin: " + IsLogin);

  if (IsLogin != undefined) IsLogin = parseInt(IsLogin); //long

  if (IsLogin == 0) {
    const agent_query = new Parse.Query("OnlineAgentLists");
    agent_query.equalTo("AgentCode", AgentCode); // where AgentCode = '1234'

    agent_query.find().then(
      function (agents) {
        //What do I do HERE to delete the posts?
        agents.forEach(function (agent) {
          agent.destroy({
            success: function () {
              // SUCCESS CODE HERE, IF YOU WANT
              console.log("Delete success: " + AgentCode);
            },
            error: function () {
              // ERROR CODE HERE, IF YOU WANT
              console.log("Delete error: " + AgentCode);
            },
          });
        });
      },
      function (error) {
        response.error(error);
      }
    );

    return returnCode;
  } else {
    // IsLogin == 1

    const query = new Parse.Query("OnlineAgentLists");
    query.equalTo("AgentCode", AgentCode);

    let results;

    try {
      results = await query.first();

      if (results == undefined) {
        // Record not found
        // Insert Data

        let onlineagentlist = new Parse.Object("OnlineAgentLists");

        if (AgentCode != undefined) onlineagentlist.set("AgentCode", AgentCode);
        else returnCode = 11;
        if (AgentName != undefined) onlineagentlist.set("AgentName", AgentName);
        else returnCode = 12;
        if (Queue != undefined) onlineagentlist.set("Queue", QueueText);
        else returnCode = 13;
        if (AgentStatus != undefined)
          onlineagentlist.set("AgentStatus", AgentStatus);
        else returnCode = 14;
        if (AgentStatusCode != undefined)
          onlineagentlist.set("AgentStatusCode", AgentStatusCode);
        else returnCode = 15;
        if (IsLogin != undefined) onlineagentlist.set("IsLogin", IsLogin);
        else returnCode = 16;
        if (startedAt != undefined) onlineagentlist.set("startedAt", startedAt);
        else returnCode = 17;

        if (returnCode == 0) onlineagentlist.save(); //Insert data
      } else {
        //  Found record
        // Update Data

        if (AgentName != undefined) results.set("AgentName", AgentName);
        else returnCode = 1;
        if (Queue != undefined) results.set("Queue", QueueText);
        else returnCode = 2;
        if (AgentStatus != undefined) results.set("AgentStatus", AgentStatus);
        else returnCode = 3;
        if (AgentStatusCode != undefined)
          results.set("AgentStatusCode", AgentStatusCode);
        else returnCode = 4;
        if (IsLogin != undefined) results.set("IsLogin", IsLogin);
        else returnCode = 5;
        if (startedAt != undefined) results.set("startedAt", startedAt);
        else returnCode = 6;

        //if (returnCode == 0) results.save();
        if (returnCode == 0) {
          results.save();
          returnCode = 9;
        }
      }

      return returnCode;
    } catch (error) {
      throw error.message;
    }
  }
});
