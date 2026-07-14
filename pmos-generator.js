const campaignType = document.getElementById("campaign-type");
const form = document.getElementById("campaign-form");

const restaurantPricing = document.getElementById("restaurant-pricing");
const servicePricing = document.getElementById("service-pricing");
const restaurantStripe = document.getElementById("restaurant-stripe");
const serviceStripe = document.getElementById("service-stripe");

const categoriesField = document.getElementById("categories");

const resultPanel = document.getElementById("result-panel");
const jsonOutput = document.getElementById("json-output");

let latestCampaign = null;


const restaurantCategories = [
  "Pizza",
  "Mexican",
  "Seafood",
  "Coffee",
  "Breakfast",
  "Burgers",
  "BBQ",
  "Ice Cream",
  "Bakery",
  "Asian",
  "Italian",
  "Food Truck",
  "Other"
];


const serviceCategories = [
  "Roofing",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Remodeling",
  "Handyman",
  "Painting",
  "Landscaping",
  "Lawn Care",
  "Pressure Washing",
  "Pest Control",
  "Pool Service",
  "Cleaning",
  "Moving",
  "Junk Removal",
  "Tree Service",
  "Garage Doors",
  "Real Estate",
  "Insurance",
  "Auto Repair",
  "Other"
];


function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}


function lines(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}


function createPositions(type, prices) {
  const positions = [];

  if (type === "restaurant") {
    for (let number = 1; number <= 3; number++) {
      positions.push({
        id: `F${number}`,
        side: "front",
        positionType: "premium",
        price: prices.premium,
        status: "available",
        categoryId: null,
        advertiserId: null
      });
    }

    for (let number = 1; number <= 6; number++) {
      positions.push({
        id: `M${number}`,
        side: "front",
        positionType: "micro",
        price: prices.micro,
        status: "available",
        categoryId: null,
        advertiserId: null
      });
    }

    for (let number = 1; number <= 11; number++) {
      positions.push({
        id: `B${number}`,
        side: "back",
        positionType: "standard",
        price: prices.standard,
        status: "available",
        categoryId: null,
        advertiserId: null
      });
    }
  }


  if (type === "service") {
    for (let number = 1; number <= 8; number++) {
      positions.push({
        id: `F${number}`,
        side: "front",
        positionType: "equal",
        price: prices.equal,
        status: "available",
        categoryId: null,
        advertiserId: null
      });
    }

    for (let number = 1; number <= 8; number++) {
      positions.push({
        id: `B${number}`,
        side: "back",
        positionType: "equal",
        price: prices.equal,
        status: "available",
        categoryId: null,
        advertiserId: null
      });
    }
  }

  return positions;
}


function updateCampaignType() {
  const type = campaignType.value;

  restaurantPricing.hidden = type !== "restaurant";
  restaurantStripe.hidden = type !== "restaurant";

  servicePricing.hidden = type !== "service";
  serviceStripe.hidden = type !== "service";

  if (type === "restaurant") {
    categoriesField.value = restaurantCategories.join("\n");

    if (!form.elements.mailboxes.value) {
      form.elements.mailboxes.value = 2500;
    }
  }

  if (type === "service") {
    categoriesField.value = serviceCategories.join("\n");

    if (!form.elements.mailboxes.value) {
      form.elements.mailboxes.value = 5000;
    }
  }
}


campaignType.addEventListener("change", updateCampaignType);


form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);

  const type = data.get("campaignType");
  const city = data.get("city").trim();
  const state = data.get("state").trim().toUpperCase();
  const edition = data.get("edition").trim();

  const defaultName =
    type === "restaurant"
      ? `${city} Restaurant Promotional Postcard`
      : `${city} Service Business Promotional Postcard`;

  const campaignName =
    data.get("campaignName").trim() || defaultName;


  const prices =
    type === "restaurant"
      ? {
          premium: Number(data.get("premiumPrice")),
          standard: Number(data.get("standardPrice")),
          micro: Number(data.get("microPrice")),
          currency: "USD"
        }
      : {
          equal: Number(data.get("equalPrice")),
          currency: "USD"
        };


  const stripe =
    type === "restaurant"
      ? {
          premium: data.get("premiumStripe").trim(),
          standard: data.get("standardStripe").trim(),
          micro: data.get("microStripe").trim()
        }
      : {
          equal: data.get("equalStripe").trim()
        };


  const layout =
    type === "restaurant"
      ? {
          templateId: "restaurant-postcard-v1",
          front: {
            premiumPositions: 3,
            microMentions: 6
          },
          back: {
            standardPositions: 11,
            microMentions: 0
          }
        }
      : {
          templateId: "service-postcard-v1",
          front: {
            equalPositions: 8
          },
          back: {
            equalPositions: 8
          }
        };


  const categories = lines(data.get("categories")).map(
    (categoryName) => ({
      id: slugify(categoryName),
      name: categoryName,
      exclusive: true,
      status: "available",
      advertiserId: null
    })
  );


  const id = slugify(
    `${city}-${type}-${edition}`
  );


  latestCampaign = {
    campaign: {
      id,
      name: campaignName,
      campaignType:
        type === "restaurant"
          ? "restaurant-postcard"
          : "service-business-postcard",

      edition,
      location: {
        city,
        state
      },

      status: "draft",

      distribution: {
        method: "USPS EDDM",
        mailboxCount: Number(data.get("mailboxes")),
        mailDate: data.get("mailDate"),
        routes: lines(data.get("routes"))
      },

      exclusivity: {
        enabled: true,
        basis: "business-category",
        lockScope: "campaign-edition"
      },

      layout,

      pricing: prices,

      categories,

      positions: createPositions(type, prices),

      assets: {
        background: data.get("background").trim(),
        frontPreview: data.get("frontPreview").trim(),
        backPreview: data.get("backPreview").trim(),
        routeMap: data.get("routeMap").trim()
      },

      stripe,

      workflow: {
        campaign: "draft",
        sales: "not_started",
        artwork: "pending",
        proofs: "pending",
        print: "pending",
        distribution: "pending"
      },

      generatedBy: "AOS PMOS Campaign Generator",
      generatedAt: new Date().toISOString()
    }
  };


  jsonOutput.textContent =
    JSON.stringify(latestCampaign, null, 2);

  resultPanel.hidden = false;

  resultPanel.scrollIntoView({
    behavior: "smooth"
  });
});


document
  .getElementById("copy-json")
  .addEventListener("click", async () => {
    if (!latestCampaign) return;

    await navigator.clipboard.writeText(
      JSON.stringify(latestCampaign, null, 2)
    );
  });


document
  .getElementById("download-json")
  .addEventListener("click", () => {
    if (!latestCampaign) return;

    const fileName =
      `${latestCampaign.campaign.id}.json`;

    const blob = new Blob(
      [JSON.stringify(latestCampaign, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  });
