import { Weights, wrand } from "./core";

const weights: Weights = {
  a: 0.03,
  b: 0.03,
  c: 1.2,
};

wrand(weights, true);

const weights2: Weights = {
  a: 5.1,
  b: 5.01,
  c: 5,
};

wrand(weights2);
