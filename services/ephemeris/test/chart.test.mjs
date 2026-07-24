import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateNatalChart,
  InputError,
  parseNatalRequest,
  zonedDateTimeToUtc,
} from "../src/chart.mjs";

test("calculates a tropical natal chart with exact local-time conversion", () => {
  const chart = calculateNatalChart({
    birthDate: "1990-06-15",
    birthTime: "12:00",
    latitude: 34.0522,
    longitude: -118.2437,
    houseSystem: "placidus",
  });

  assert.equal(chart.planets.sun.sign, "Gemini");
  assert.equal(chart.input.timeZone, "America/Los_Angeles");
  assert.equal(chart.input.timeKnown, true);
  assert.equal(chart.houses.length, 12);
  assert.equal(chart.planets.sun.house, 10);
  assert.match(chart.utc, /^1990-06-15T19:00:00\.000Z$/);
});

test("uses local noon while excluding time-bound placements upstream when no time is supplied", () => {
  const chart = calculateNatalChart({
    birthDate: "1990-06-15",
    birthTime: null,
    latitude: 34.0522,
    longitude: -118.2437,
    houseSystem: "placidus",
  });

  assert.equal(chart.input.timeKnown, false);
  assert.equal(chart.input.birthTime, null);
});

test("rejects invalid request parameters", () => {
  assert.throws(
    () =>
      parseNatalRequest(new URLSearchParams("date=1990-02-31&lat=34&lon=-118")),
    InputError,
  );
});

test("converts local civil time to UTC using the coordinate timezone", () => {
  const result = zonedDateTimeToUtc({
    birthDate: "1990-06-15",
    birthTime: "12:00",
    latitude: 34.0522,
    longitude: -118.2437,
  });
  assert.equal(result.timeZone, "America/Los_Angeles");
  assert.equal(result.date.toISOString(), "1990-06-15T19:00:00.000Z");
});
