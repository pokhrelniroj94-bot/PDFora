import assert from "node:assert/strict";
import { runNepaliBusinessTool } from "../lib/i18n/nepali-business-tools.ts";

assert.match(runNepaliBusinessTool("profit-margin-calculator",{revenue:"200000",cost:"150000"}),/नाफा मार्जिन: 25%/);
assert.match(runNepaliBusinessTool("profit-margin-calculator",{revenue:"0",cost:"10"}),/बिक्री रकम सकारात्मक/);
assert.match(runNepaliBusinessTool("markup-calculator",{cost:"1000",markup:"30"}),/बिक्री मूल्य: NPR 1,300/);
assert.match(runNepaliBusinessTool("markup-calculator",{cost:"1000",markup:"1001"}),/markup ०–१०००%/);
assert.match(runNepaliBusinessTool("break-even-calculator",{fixed:"100000",variable:"250",price:"500"}),/ब्रेक-इभेन मात्रा: 400 एकाइ/);
assert.match(runNepaliBusinessTool("break-even-calculator",{fixed:"100000",variable:"500",price:"500"}),/बिक्री मूल्य चल लागतभन्दा बढी/);
assert.match(runNepaliBusinessTool("sales-tax-calculator",{price:"1000",rate:"13"}),/करसहित कुल: NPR 1,130/);
assert.match(runNepaliBusinessTool("sales-tax-calculator",{price:"1000",rate:"101"}),/करदर ०–१००%/);
assert.match(runNepaliBusinessTool("salary-breakdown-calculator",{gross:"50000",tax:"2500",provident:"3000",other:"500"}),/हातमा आउने तलब: NPR 44,000/);
assert.match(runNepaliBusinessTool("salary-breakdown-calculator",{gross:"10000",tax:"9000",provident:"2000",other:"0"}),/कटौती कुल तलबभन्दा बढी/);
assert.match(runNepaliBusinessTool("commission-calculator",{sales:"100000",rate:"5"}),/कमिसन रकम: NPR 5,000/);
assert.match(runNepaliBusinessTool("commission-calculator",{sales:"100000",rate:"101"}),/कमिसन दर ०–१००%/);
assert.match(runNepaliBusinessTool("hourly-to-salary-calculator",{hourly:"500",hours:"40",weeks:"48"}),/वार्षिक कुल: NPR 960,000/);
assert.match(runNepaliBusinessTool("hourly-to-salary-calculator",{hourly:"500",hours:"169",weeks:"48"}),/घण्टा १६८ भन्दा बढी नहुने/);
console.log("Nepali business calculator functional tests passed (14 assertions).");
