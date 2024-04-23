import { proxy } from "valtio";

const state = proxy({
  activeIndex: 1,
  users: [],
  riders: [],
  passengers: [],
  requests: [],
});

export default state;
