import { test } from 'node:test';
import assert from 'node:assert/strict';
import { savingsPlan, realValue, avSubsidy, buildSummaryText } from './calc.js';

test('Sparplan: Beispiel aus der Mail (200 €, 20 J., 7,02 %)', () => {
  const r = savingsPlan({ monthly: 200, years: 20, ratePa: 0.0702 });
  assert.ok(Math.abs(r.total - 101900) < 300, `total ${r.total}`);
  assert.equal(r.paidIn, 48000);
  assert.equal(r.gains, r.total - r.paidIn);
  assert.equal(r.series.length, 21);
  assert.equal(r.series[0].total, 0);
});

test('Sparplan: Randfälle bleiben endlich', () => {
  assert.equal(savingsPlan({ monthly: 100, years: 10, ratePa: 0 }).total, 12000);
  assert.equal(savingsPlan({ monthly: 0, years: 10, ratePa: 0.07 }).total, 0);
  const one = savingsPlan({ monthly: 50, years: 1, ratePa: 0.07 });
  assert.ok(Number.isFinite(one.total) && one.total > 600);
  assert.ok(savingsPlan({ monthly: 0, years: 10, ratePa: 0.07, start: 1000 }).total > 1900);
});

test('Kaufkraft nach Inflation', () => {
  assert.ok(Math.abs(realValue(10000, 20, 0.02) - 6730) < 10);
  assert.equal(realValue(10000, 0, 0.02), 10000);
});

test('AV-Zulagen an den Grenzen', () => {
  const z = (annual, kids = 0, under25 = false) => avSubsidy({ annual, kids, under25 });
  assert.equal(z(119.99).total, 0);
  assert.equal(z(119.99).eligible, false);
  assert.equal(z(120).base, 60);
  assert.equal(z(360).base, 180);
  assert.equal(z(1800).base, 540);
  assert.equal(z(6840).base, 540);
  assert.equal(z(1800, 2).kids, 600);
  assert.equal(z(150, 1).kids, 150);
  assert.equal(z(119, 2).kids, 0);
  assert.equal(z(1800, 0, true).starter, 200);
  assert.equal(z(1800, 1, true).total, 540 + 300 + 200);
});

test('Zusammenfassung passt in einen mailto-Link', () => {
  const t = buildSummaryText({ monthly: 200, years: 20, ratePa: 0.0702, total: 101900, paidIn: 48000 });
  assert.ok(t.includes('101.900'));
  assert.ok(encodeURIComponent(t).length < 1800 * 3);
  assert.ok(t.length < 1800);
});
