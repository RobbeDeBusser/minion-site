import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const CLOUD_DOC = (uid) => doc(db, "users", uid, "gamedata", "save");

/**
 * Save user game data to Firestore.
 * @param {string} uid - Firebase user ID
 * @param {object} data - The game state to save
 */
export async function saveUserData(uid, data) {
  try {
    await setDoc(CLOUD_DOC(uid), { ...data, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn("[CloudSave] Failed to save:", err);
  }
}

/**
 * Load user game data from Firestore.
 * @param {string} uid - Firebase user ID
 * @returns {object|null} The saved game data, or null if not found
 */
export async function loadUserData(uid) {
  try {
    const snap = await getDoc(CLOUD_DOC(uid));
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn("[CloudSave] Failed to load:", err);
    return null;
  }
}

/**
 * Merge local and cloud data, favouring the highest banana count
 * and most recently updated fields to avoid data loss.
 * @param {object} local - Data from localStorage
 * @param {object} cloud - Data from Firestore
 * @returns {object} Merged game data
 */
export function mergeLocalAndCloud(local, cloud) {
  if (!cloud) return local;
  if (!local) return cloud;

  return {
    ...cloud,
    // Always keep the highest banana count so the player never loses bananas
    bananaCount: Math.max(local.bananaCount || 0, cloud.bananaCount || 0),
    // Use cloud data for everything else (most recently saved wins)
    userName: cloud.userName || local.userName || "",
    isAdmin: cloud.isAdmin || local.isAdmin || false,
    useApi: cloud.useApi !== undefined ? cloud.useApi : (local.useApi !== undefined ? local.useApi : true),
    isDiscountActive: cloud.isDiscountActive || local.isDiscountActive || false,
    globalVolume: cloud.globalVolume !== undefined ? cloud.globalVolume : (local.globalVolume || 0.5),
    shopItems: cloud.shopItems || local.shopItems || null,
    avatarSettings: cloud.avatarSettings || local.avatarSettings || null,
    activeMission: cloud.activeMission || local.activeMission || null,
    missionProgress: cloud.missionProgress || local.missionProgress || 0,
    missionClaimed: cloud.missionClaimed !== undefined ? cloud.missionClaimed : (local.missionClaimed || false),
    missionStarted: cloud.missionStarted !== undefined ? cloud.missionStarted : (local.missionStarted || false),
    nextMissionTime: cloud.nextMissionTime || local.nextMissionTime || 0,
    favoriteStock: cloud.favoriteStock || local.favoriteStock || "BAN",
  };
}
