var modules = [
	// {
	// 	"name": "Game Management",
	// 	"code": 101,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 		"name": "Table",
	// 		"code": 102,
	// 		"route": "listTable",
	// 		"iconClass": "icon-puzzle",
	// 		"status": true
	// 	}]
	// },
	// {
	// 	"name": "Spam Management",
	// 	"code": 501,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 		"name": "Spam Words",
	// 		"code": 501,
	// 		"route": "spamWords",
	// 		"iconClass": "icon-home",
	// 		"status": true
	// 	}]
	// },
	// {
	// 	"name": "Bonus Management",
	// 	"code": 401,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 			"name": "Generate Code",
	// 			"code": 402,
	// 			"route": "generateBonusCode",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "Deposit Code List",
	// 			"code": 403,
	// 			"route": "listBonusDeposit",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "Bonus History",
	// 			"code": 404,
	// 			"route": "bonusHistory",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		}
	// 	]
	// },
	{
		"name": "Scratch Card Management",
		"code": 701,
		"iconClass": "icon-settings",
		"status": true,
		"subModule": [{
				"name": "Generate Scratch Card",
				"code": 702,
				"route": "generateCardPromotions",
				"iconClass": "icon-puzzle",
				"status": true,
				"subModule": [
				// {
				// 		"name": "Promotions",
				// 		"code": 7023,
				// 		"route": "generateCardPromotions",
				// 		"iconClass": "icon-puzzle",
				// 		"status": true
				// 	},
					{
						"name": "Affiliate",
						"code": 7021,
						"route": "generateCardAffiliate",
						"iconClass": "icon-puzzle",
						"status": true
					}
					// {
					// 	"name": "Emergency",
					// 	"code": 7022,
					// 	"route": "generateCardEmergency",
					// 	"iconClass": "icon-puzzle",
					// 	"status": true
					// },
					// {
					// 	"name": "High-Rollers",
					// 	"code": 7024,
					// 	"route": "generateCardHighRollers",
					// 	"iconClass": "icon-puzzle",
					// 	"status": true
					// }
				]
			},
			// {
			// 	"name": "Approve Scratch Card",
			// 	"code": 703,
			// 	"route": "approveScratchCard",
			// 	"iconClass": "icon-puzzle",
			// 	"status": true
			// },
			{
				"name": "Scratch History",
				"code": 704,
				"route": "scratchCardHistory",
				"iconClass": "icon-puzzle",
				"status": true
			}
		]
	},
	// {
	// 	"name": "Loyalty Points Management",
	// 	"code": 801,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 			"name": "Create Loyalty Points",
	// 			"code": 802,
	// 			"route": "createLoyaltyPoints",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "List Loyalty Points",
	// 			"code": 803,
	// 			"route": "listLoyaltyPoints",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		}
	// 	]
	// },
	// {
	// 	"name": "PAN Card Management",
	// 	"code": 901,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 		"name": "PAN card Approval",
	// 		"code": 902,
	// 		"route": "approvePAN",
	// 		"iconClass": "icon-puzzle",
	// 		"status": true
	// 	}]
	// },
	{
		"name": "Chips Management",
		"code": 1000,
		"iconClass": "icon-settings",
		"status": true,
		"subModule": [{
				"name": "Transfer To Player",
				"code": 1001,
				"route": "transferFund",
				"iconClass": "icon-puzzle",
				"status": true
			},
			// {
			// 	"name": "Transfer To Affiliate",
			// 	"code": 1002,
			// 	"route": "transferFundToAffiliate",
			// 	"iconClass": "icon-puzzle",
			// 	"status": true
			// },
			{
				"name": "Withdraw Chips",
				"code": 1003,
				"route": "withdrawChips",
				"iconClass": "icon-puzzle",
				"status": true
			},
			{
				"name": "Withdraw History",
				"code": 1004,
				"route": "withdrawChipsHistory",
				"iconClass": "icon-puzzle",
				"status": true
			},
			{
				"name": "Transfer History Player",
				"code": 1005,
				"route": "transferHistoryPlayer",
				"iconClass": "icon-puzzle",
				"status": true
			},
			{
				"name": "Transfer History Affiliate",
				"code": 1006,
				"route": "transferHistoryAffiliate",
				"iconClass": "icon-puzzle",
				"status": true
			}
		]
	},
	// {
	// 	"name": "User Management",
	// 	"code": 601,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 			"name": "Create user",
	// 			"code": 602,
	// 			"route": "createAffiliate",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "List User",
	// 			"code": 603,
	// 			"route": "listAffiliate",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		}
	// 	]
	// },
	// {
	// 	"name": "New User Management",
	// 	"code": 1101,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 			"name": "Create user",
	// 			"code": 1102,
	// 			"route": "createUser",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "Create Affiliate",
	// 			"code": 603,
	// 			"route": "listAffiliate",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		}
	// 	]
	// }
];
 
// console.log(modules);

if (typeof(Storage) !== "undefined") {
    localStorage.setItem("modules", JSON.stringify(modules));
} else {
    console.log("no Storage found.");
}