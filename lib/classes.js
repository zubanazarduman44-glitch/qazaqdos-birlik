// «Менің сыныбым»: Supabase REST арқылы (кестелер supabase/classes.sql ішінде)
import { authed } from "./auth";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const genCode = () => Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");

export const isSetupError = (e) => e && (e.status === 404 || /PGRST205|relation|does not exist/i.test(e.body || ""));

export async function createClass(name) {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await authed("/rest/v1/qd_classes", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ name, code: genCode() }) });
      return r[0];
    } catch (e) {
      if (!/23505|duplicate/i.test(e.body || "")) throw e;
    }
  }
  throw new Error("code-collision");
}
export const ownedClasses = (uid) => authed(`/rest/v1/qd_classes?owner=eq.${uid}&select=*&order=created_at.desc`);
export const joinedClasses = async (uid) => {
  const rows = await authed(`/rest/v1/qd_members?user_id=eq.${uid}&select=class_id,qd_classes(id,name,code,owner)`);
  return (rows || []).map((r) => r.qd_classes).filter(Boolean);
};
export const joinClass = (code, name, avatar) => authed("/rest/v1/rpc/join_class", { method: "POST", body: JSON.stringify({ p_code: code, p_name: name, p_avatar: avatar }) });
export const leaveClass = (cid, uid) => authed(`/rest/v1/qd_members?class_id=eq.${cid}&user_id=eq.${uid}`, { method: "DELETE" });
export const deleteClass = (cid) => authed(`/rest/v1/qd_classes?id=eq.${cid}`, { method: "DELETE" });
export const removeMember = (cid, uid) => authed(`/rest/v1/qd_members?class_id=eq.${cid}&user_id=eq.${uid}`, { method: "DELETE" });
export const listMembers = (cid) => authed(`/rest/v1/qd_members?class_id=eq.${cid}&select=*&order=week_xp.desc`);
export const listTasks = (cid) => authed(`/rest/v1/qd_tasks?class_id=eq.${cid}&select=*&order=created_at.desc`);
export const createTask = (t) => authed("/rest/v1/qd_tasks", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(t) }).then((r) => r[0]);
export const deleteTask = (id) => authed(`/rest/v1/qd_tasks?id=eq.${id}`, { method: "DELETE" });
export const listSubs = (taskIds) => (taskIds.length ? authed(`/rest/v1/qd_subs?task_id=in.(${taskIds.join(",")})&select=*`) : Promise.resolve([]));
export const upsertSub = (row) => authed("/rest/v1/qd_subs?on_conflict=task_id,user_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ ...row, updated_at: new Date().toISOString() }) });
export const syncMember = (cid, uid, stats) => authed(`/rest/v1/qd_members?class_id=eq.${cid}&user_id=eq.${uid}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ ...stats, last_active: new Date().toISOString() }) });
