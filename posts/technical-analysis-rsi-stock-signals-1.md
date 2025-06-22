---
title: "Technical Analysis: RSI Stock Signals [Part 1]"
description: "Can we turn a profit in the stock market using just RSI?"
slug: "technical-analysis-rsi-stock-signals-1"
published: "true"
createdAt: "2024-11-15T01:15:47.734Z"
updatedAt: "2025-06-22T00:30:45.065Z"
publishedAt: "2025-06-22T00:30:45.081Z"
author: "Chad Furman"
category: "stock-signals"
tags: ["rsi", "stock-signals", "technical-analysis"]
cover: "/uploads/Artboard_1_7208893937.png"
project: "stock-signals"
---

## Problem Statement

The global stock market has [nearly 160 million people in the US alone participating in trading activity each day.](https://www.fool.com/research/how-many-americans-own-stock/) Due to market-influencing events like political climate, economic negotiations, product breakthroughs, company mergers & acquisitions, and other unforeseen events, this market is [notoriously volatile and unpredictable](https://www.investopedia.com/articles/basics/04/100804.asp#:~:text=The%20political%20situation%2C%20negotiations%20between,stocks%20and%20the%20stock%20market.). As researchers, we are curious yet cautious of participating in the stock market, so we ask ourselves the question posed by [quantitative trading](https://www.cqf.com/blog/what-quantitative-trading#:~:text=What%20Is%20Quantitative%20Trading%3F,opportunities%20in%20the%20financial%20markets): “Is it possible to turn a profit in the stock market using known technical indicators?”

For our first entry into technical analysis, we explore one common technical indicator: [RSI, the Relative Strength Index](https://www.investopedia.com/terms/r/rsi.asp).  We hypothesize that we can develop a trading strategy based entirely on RSI which generates a profit in the stock market, and that we can verify this using backtesting.


>Hypothesis: "A trading strategy based exclusively on RSI can generate a profit"

We will be using RSI in excess of 70 to signal overbought, and RSI less than 30 to signal oversold.  We predict that entering the market at the first “oversold” signal, and then exiting the market at the first subsequent “overbought” signal will yield a profit.  We will measure our success against the S&P 500 as well as the average RoR of 7% and a "golden target" of 50% RoR.

## Data Sources

[Alpha Vantage](https://www.alphavantage.co/): API for accessing time series stock from data global sources including NASDAQ, London Stock Exchange, XETRA, BSE, Shenzhen Stock Exchange, and others. Our focus is on the “TIME\_SERIES\_DAILY” (“Daily”) API which provides historical data for the last 20 years of stock market activity. The data is delayed by 5 minutes (real-time data is available for a fee).  We selected the Alpha Vantage API because most financial APIs are highly expensive to access (hundreds if not thousands of dollars per month), and Alpha Vantage provides low-volume time-delayed access for free.  
This data set includes open, high, low, close, and volume data for each day in the range we request.  This data is also known as candlestick or OHLCV(open, high, low, close, volume) data: 

* Date: (YYYY-MM-DD) The day that the stock market was trading   
* Open: (currency, float, four decimals, USD) the price of the stock at the time trading started on date  
* High:  (currency, float, four decimals, USD)  the highest price that the stock achieved on that date  
* Low: (currency, float, four decimals, USD)  the lowest price the stock achieved on that date  
* Close: (currency, float, four decimals, USD)  the price of the stock at the time trading stopped on date  
* Volume: (integer) The number of shares bought and sold on that date

For our RSI calculation, we will be relying on the RSI implementation in [TA-Lib](https://ta-lib.org/) accessed through [ta-lib-python](https://github.com/ta-lib/ta-lib-python) using the default UNSTABLE\_PERIOD (the number of previous candlesticks to consider).  Based on the code in TA-Lib, this should be [the RSI implementation as originally defined by Wilder](https://github.com/TA-Lib/ta-lib/blob/main/src/ta_func/ta_RSI.c#L208).

## Strategy

For the first milestone of this research, we chose to simplify our variables.  We are focusing on a single security, IBM, within a specific time range (2021-01-01 to 2023-01-01).  These constraints are imposed somewhat arbitrarily, and subsequent research will explore RSI under alternative conditions.

The use of RSI as calculated by TA-lib on this security in this time range goes as follows.  For every day in the time range, first look for an entry point (a BUY signal).  A BUY signal is an RSI value 30 or lower.  At the first BUY signal, make a purchase of enough shares to exhaust your cash reserves while accounting for a transaction cost of 0.1%.  For example, $10,000 cash-on-hand could by 99 shares at a per-share price of $100 (99 \* $100 \* 1.001 \= $9,909.9) and would leave $90.10.

Once the entry is made, the algorithm continues to iterate through the remaining days until it finds the first SELL signal (a SELL signal is an RSI value 70 or higher).  At the first SELL signal, all shares are sold assuming again a transaction cost of 0.1%.  

Note that the “per-share price” is calculated as the average of the open/high/low/close prices on the day following the BUY/SELL signal.  This is because the RSI calculation is based on the closing price of the previous day, and any transactions based on the RSI calculation are assumed to take place the following day.  Ideally we would always use the opening price for the RSI calculation, though it is not guaranteed that we would secure the opening price for any transaction and thus an average of the various prices on the day is used instead.

## Data Pipeline  
**Collection:** We collect the [daily time-series data](https://www.alphavantage.co/documentation/#time-series-data) from AlphaVantage API, manually-queried using the web browser and saved as a JSON object, which is then manipulated using Python.

**Extraction:** The data contains two top-level keys including Meta Data and Time Series (Daily). To extract the data, we only grab the Time Series (Daily) key as a new dictionary, with keys designated as YYYY-MM-DD date objects, and values as objects containing 5 keys: open, high, low, close, and volume. 

Open, high, low, and close are the price of the given ticker symbol to 4 decimal places of accuracy, and volume is the number of stock items traded on that given date. Each of these columns are assigned their own array of length *n,* where *n* \= the number of trading data days within the interval. These arrays are assigned to a dataframe and converted to floats. 

## Insights

![RSI signals between January 2021 and January 2023](http://localhost:1337/uploads/stock_data_f24b85b9d0.png "RSI signals between January 2021 and January 2023")

This graph was generated using vega-altairs and a subset of stock data for the IBM stock within the date range 2021-01-01 and 2023-01-01. This visualization shows RSI from January 2021 and January 2023, illustrating buying and selling signals based on closing prices. Orange lines indicate RSI at or over 70 signaling overbought stock and thus a sell signal (with red lines indicating RSI over 80). Lime green lines indicate RSI at or below 30 indicating oversold and signaling us to buy (with dark green indicating below 20). The blue line graph in the middle shows RSI values. As the RSI value crosses the red signal lines, selling and buying signals are generated respectively.

## Conclusions & Findings  
Starting with $10,000, we ‘purchased’ the maximum amount of whole shares we could afford (factoring in a 0.1% transaction fee) at the first “buy” signal, and ‘sold’ all of those shares at the first subsequent sell signal. We then repeated this process for the next buy signal and sell signal until we encountered the last day of our date range.  

We have observed that if the stock was purchased with 100% of our cash-on-hand at the first BUY signal (green or lime-green line, whichever comes first) and then 100% of our holdings are sold at the first orange or red line, a profit is generated.  At the end of the 2 years (from 2021-01-01 to 2023-01-01) for the IBM stock, the result was a total cash-out value of $10949.16 ($101.40 cash on hand and 87 shares at a final per-share price of $124.67).  This is about a 9.5% rate of return.  
   
In comparison, according to [Yahoo Finance](https://finance.yahoo.com/quote/%5EGSPC/history/?period1=1609459200&period2=1672531200) the S\&P 500 between 2021-01-01 and 2023-01-01 opened January 4th at $3,764.61 and closed December 30th at $3,839.50 – a measly gain of $75 likely brought on by pandemic struggles.

While we did beat the S\&P 500 with both of our trading strategies, and we did beat the 7% annualized rate of return promised by some investment portfolios, we did not broach the quantitative analyst target of 30-50% RoR.

 Initial results are promising, but more research is needed.

## Planned next steps:  
There is quite a bit more we can look into.  While we are early in our Quantitative Analysis (QA) journey, we plan to stick to researching RSI under various constraints:

* across more time periods  
* With variable entry and exit dates  
* Across various securities within the same market sector  
* Across different sectors of the stock market  
* Running the algorithm on intra-day trading values (i.e. hourly)  
* Adjusting the RSI period from 14 days to 7 days, or to 21 days or 30 days  
* Experiment with adding pessimistic variance on the strike price

We picked RSI because it was already somewhat familiar to us and it was mentioned in [Investopedia’s 7 indicators for a technical analysis toolkit](https://www.investopedia.com/top-7-technical-analysis-tools-4773275).  However, we want to experiment with the other indicators mentioned by investopedia:

* On-balance volume (OBV)  
* Accumulation/distribution (A/D) line  
* Average directional index  
* Aroon oscillator  
* Moving average convergence divergence (MACD)  
* Relative strength index (RSI)  
* Stochastic oscillator

We will want to study other variables as well.  Some of this could include the effect of accounting for dividend dates (and dividend amounts), seasons, start/end of week and month, sentiment of the news cycle, and underlying fundamentals of the stock in question (“fundamental analysis”) as well as macroeconomic conditions (federal interest rates, RoR on bonds and savings accounts, geopolitical unrest, etc) and various geographies..

Additionally, it’s worth noting that the stock we have experimented on is a blue-chip company which already has strong fundamentals, corporate governance, and high trading volume.  Extrapolating this research to trading in small-cap, emerging markets, cryptocurrency, or penny stocks will further ground and help generalize our technical analysis strategies.