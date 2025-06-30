import { Community } from '../types';

export const communities: Community[] = [
  {
    name: "Kodular",
    base: "https://community.kodular.io",
    catPath: "/c/extensions/5.json",
    searchPath: "/search.json?q=",
    spSuffix: "%20%23extensions",
    icon: "Blocks",
    color: "#FF6B35"
  },
  {
    name: "MIT App Inventor",
    base: "https://community.appinventor.mit.edu",
    catPath: "/c/extensions/17.json",
    searchPath: "/search.json?q=",
    spSuffix: "%20category%3Aextensions",
    icon: "Cpu",
    color: "#4CAF50"
  },
  {
    name: "Niotron",
    base: "https://community.niotron.com",
    catPath: "/c/extension/10.json",
    searchPath: "/search.json?q=",
    spSuffix: "%20%23extension",
    icon: "Zap",
    color: "#9C27B0"
  },
  {
    name: "Android Builder",
    base: "https://community.androidbuilder.in",
    catPath: "/c/extensions/9.json",
    searchPath: "/search.json?q=",
    spSuffix: "%20%23extensions",
    icon: "Smartphone",
    color: "#FF9800"
  }
];

export const TAG_REGEX = /[\s(?:paid|PAID|free|FREE|f\/os|F\/OS|wip|WIP|Freemium|FREEMIUM)\s*]/;
export const RATE_LIMIT_DELAY = 200;
export const INITIAL_LOAD_COUNT = 10;
export const LOAD_MORE_COUNT = 10;