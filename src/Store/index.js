import { proxy } from "valtio";

const state = proxy({
  activeIndex: 1,
  users: [],
  riders: [],
  passengers: [],
});

export default state;
