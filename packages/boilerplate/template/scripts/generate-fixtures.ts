import axios from "axios";

async function main() {
  const unauthenticatedAxios = axios.create({
    baseURL: "http://localhost:3333",
  });

  // initial setup for authenticated users

  console.log("Creating Owner");
  const ownerResponse = (
    await unauthenticatedAxios.post("/register", {
      name: "Bob Dobolina",
      email: "mealection-owner@grr.la",
      password: "fooBAR123$%^",
    })
  ).data;
  const owner = ownerResponse.user;

  console.log("Creating Joiner");
  const joinerResponse = (
    await unauthenticatedAxios.post("/register", {
      name: "Jon Bon Jovi",
      email: "mealection-joiner@grr.la",
      password: "fooBAR123$%^",
    })
  ).data;
  const joiner = joinerResponse.user;

  const ownerAxios = axios.create({
    baseURL: "http://localhost:3333",
  });

  const joinerAxios = axios.create({
    baseURL: "http://localhost:3333",
  });

  ownerAxios.interceptors.request.use(
    (config) => {
      // attach headers for auth
      if (!config.headers) {
        config.headers = {};
      }

      config.headers.Authorization = `Bearer ${ownerResponse.accessToken}`;

      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  joinerAxios.interceptors.request.use(
    (config) => {
      // attach headers for auth
      if (!config.headers) {
        config.headers = {};
      }

      config.headers.Authorization = `Bearer ${joinerResponse.accessToken}`;

      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Create owner fixtures
  console.log("Creating Team");
  const team = (
    await ownerAxios.post("/teams", {
      name: "Family",
    })
  ).data;

  // invite joiner to team
  console.log("Inviting Joiner to Team");
  await ownerAxios.post(`/teams/${team.teamId}/teammates`, {
    email: "mealection-joiner@grr.la",
  });

  // create poll
  console.log("Creating Poll");
  const poll = (
    await ownerAxios.post("/polls", {
      name: "Dinner",
      teamId: team.teamId,
      pollType: "home",
    })
  ).data;

  // add meals
  console.log("Creating Meal: Chinese Food");
  const chineseFood = (
    await ownerAxios.post("/meals", {
      pollId: poll.pollId,
      name: "Chinese Food",
      unsplashImageData: {
        thumbUrl:
          "https://images.unsplash.com/photo-1634864572872-a01c21e388d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzg0NTB8MHwxfHNlYXJjaHwxfHxDaG93JTIwbWVpbnxlbnwwfHx8fDE2NDA1NTYyMDg&ixlib=rb-1.2.1&q=80&w=200",
        imageUrl:
          "https://images.unsplash.com/photo-1634864572872-a01c21e388d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzg0NTB8MHwxfHNlYXJjaHwxfHxDaG93JTIwbWVpbnxlbnwwfHx8fDE2NDA1NTYyMDg&ixlib=rb-1.2.1&q=80&w=1080",
        author: "Focused on You",
        authorUrl: "https://unsplash.com/@focusedonyou",
      },
    })
  ).data;

  console.log("Creating Meal: Fish and Chips");
  const fishAndChips = (
    await ownerAxios.post("/meals", {
      pollId: poll.pollId,
      name: "Fish and chips",
      unsplashImageData: {
        thumbUrl:
          "https://images.unsplash.com/photo-1576777647209-e8733d7b851d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzg0NTB8MHwxfHNlYXJjaHwxfHxGaXNoJTIwYW5kJTIwQ2hpcHN8ZW58MHx8fHwxNjQwNTU2MzQ1&ixlib=rb-1.2.1&q=80&w=200",
        imageUrl:
          "https://images.unsplash.com/photo-1576777647209-e8733d7b851d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzg0NTB8MHwxfHNlYXJjaHwxfHxGaXNoJTIwYW5kJTIwQ2hpcHN8ZW58MHx8fHwxNjQwNTU2MzQ1&ixlib=rb-1.2.1&q=80&w=1080",
        author: "Julia Karnavusha",
        authorUrl: "https://unsplash.com/@julkarrr",
      },
    })
  ).data;

  console.log("Creating Meal: Burgers");
  const burgers = (
    await ownerAxios.post("/meals", {
      pollId: poll.pollId,
      name: "Burgers",
      unsplashImageData: {
        thumbUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzg0NTB8MHwxfHNlYXJjaHwyfHxCdXJnZXJ8ZW58MHx8fHwxNjQwNTU2MjM2&ixlib=rb-1.2.1&q=80&w=200",
        imageUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzg0NTB8MHwxfHNlYXJjaHwyfHxCdXJnZXJ8ZW58MHx8fHwxNjQwNTU2MjM2&ixlib=rb-1.2.1&q=80&w=1080",
        author: "amirali mirhashemian",
        authorUrl: "https://unsplash.com/@amir_v_ali",
      },
    })
  ).data;

  console.log("Creating Meal: Chicken Alfredo");
  const chickenAlfredo = (
    await ownerAxios.post("/meals", {
      pollId: poll.pollId,
      name: "Chicken Alfredo",
      unsplashImageData: {
        thumbUrl:
          "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzg0NTB8MHwxfHNlYXJjaHwxfHxDaGlja2VuJTIwQWxmcmVkb3xlbnwwfHx8fDE2NDA1NTYzMTE&ixlib=rb-1.2.1&q=80&w=200",
        imageUrl:
          "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzg0NTB8MHwxfHNlYXJjaHwxfHxDaGlja2VuJTIwQWxmcmVkb3xlbnwwfHx8fDE2NDA1NTYzMTE&ixlib=rb-1.2.1&q=80&w=1080",
        author: "Pixzolo Photography",
        authorUrl: "https://unsplash.com/@pixzolo",
      },
    })
  ).data;

  console.log("Creating Restaurant: Cornelly (Pizza)");
  const pizzaRestaurant = (
    await ownerAxios.post("/restaurants", {
      pollId: poll.pollId,
      name: "Cornelly",
      yelpId: "EwrAoy7XbX8nfemZdDvupA",
    })
  ).data;

  console.log("Creating Restaurant: Thai-U-Up (Thai)");
  const thaiRestaurant = (
    await ownerAxios.post("/restaurants", {
      pollId: poll.pollId,
      name: "Thai-U-Up",
      yelpId: "mkHAOMqcXh7l4X3ckGQ_xg",
    })
  ).data;

  console.log("Creating Restaurant: Hallava Falafel (Falafel)");
  const falafelRestaurant = (
    await ownerAxios.post("/restaurants", {
      pollId: poll.pollId,
      name: "Hallava Falafel",
      yelpId: "54kD7ctg54NXuRZmelZkRw",
    })
  ).data;
}

main();
