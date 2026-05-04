// Admin API for Roblox Script
const adminData = {
  status: "success",
  access: true,
  whitelisted: true,
  adminLevel: 3,
  whitelist: [
    "adam_saadi8737",
    "pro628713_arch"
  ],
  permissions: {
    ban: true,
    kick: true,
    teleport: true,
    bring: true,
    kill: true,
    freeze: true,
    godmode: true,
    crash: true,
    shutdown: true,
    message: true
  },
  commands: [
    "ban",
    "kick",
    "teleport",
    "bring",
    "kill",
    "freeze",
    "unfreeze",
    "godmode",
    "setspeed",
    "message"
  ]
};

// دالة التحقق من الأدمن
function checkAdmin(playerName) {
  if (adminData.access && adminData.whitelisted) {
    for (let i = 0; i < adminData.whitelist.length; i++) {
      if (adminData.whitelist[i].toLowerCase() === playerName.toLowerCase()) {
        return {
          access: true,
          adminLevel: adminData.adminLevel,
          permissions: adminData.permissions
        };
      }
    }
  }
  return { access: false };
}

// للاستخدام مع Node.js/Express
function getAdminData() {
  return adminData;
}
