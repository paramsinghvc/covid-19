import "core-js";
import React, { useEffect, FC, useCallback, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import fetch from "isomorphic-unfetch";
import get from "lodash/get";

import Shell from "../components/Shell";
import variables from "../shared/variables";

const Home = ({ data, totalData }: any) => {
  type SelectedCountryData = {
    confirmed: number;
    deaths: number;
    recovered: number;
    id: string;
    value: number;
    name: string;
  };

  const [selectedCountry, setSeletedCountry] = useState<SelectedCountryData>(
    totalData
  );
  useEffect(() => {
    am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("covid-geochart", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Orthographic();
    chart.panBehavior = "rotateLongLat";
    chart.deltaLatitude = -20;
    chart.padding(20, 20, 20, 20);

    // limits vertical rotation
    chart.adapter.add("deltaLatitude", function(deltaLatitude) {
      return am4core.math.fitToRange(deltaLatitude, -90, 90);
    });

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: am4core.color(variables.orange),
      max: am4core.color("#994832")
    });
    polygonSeries.data = data;
    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    const hitHandler = function(ev) {
      const obj = get(ev, "target.dataItem.dataContext");
      if (obj) {
        setSeletedCountry(obj);
      }
    };
    polygonSeries.mapPolygons.template.events.on("hit", hitHandler);

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name} - {value}";
    // polygonTemplate.fill = am4core.color(variables.orange);
    polygonTemplate.stroke = am4core.color("#454a58");
    polygonTemplate.strokeWidth = 0.5;
    // polygonTemplate.fontFamily = "sans-serif";
    // polygonTemplate.tooltip.fontFamily = "Futura";

    let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
    graticuleSeries.mapLines.template.line.stroke = am4core.color("#ffffff");
    graticuleSeries.mapLines.template.line.strokeOpacity = 0.08;
    graticuleSeries.fitExtent = false;

    chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1.0;
    chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color(
      "#454a58"
    );
    chart.background.fill = am4core.color("#454a58");

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0).brighten(-0.5);

    let animation: am4core.Animation;
    setTimeout(function() {
      animation = chart.animate(
        { property: "deltaLongitude", to: 100000 },
        20000000
      );
    }, 3000);

    chart.seriesContainer.events.on("down", function() {
      if (animation) {
        animation.stop();
      }
    });

    return () => {
      polygonSeries.mapPolygons.template.events.off("hit", hitHandler);
      chart.dispose();
    };
  }, []);

  const getInkPercentage = useCallback(
    (caseType: string) => {
      const result =
        (get(selectedCountry, caseType, 0) / get(totalData, caseType)) * 100;
      return Number.isNaN(result) ? 0 : result + "%";
    },
    [selectedCountry, totalData]
  );

  return (
    <Shell>
      <div className="container">
        <main id="covid-geochart">Charts</main>
        <section className="bottom-sheet">
          <h3>COVID-19 Tracker</h3>
          <div className="country-info">
            <img
              className="flag-icon"
              src={`/flags/${get(
                selectedCountry,
                "id",
                "GLOBE"
              ).toLowerCase()}.svg`}
            />
            <p className="country-name">
              {get(selectedCountry, "name", "Global Status")}
            </p>
          </div>
          <div className="meter-section confirmed">
            <div className="upper-section">
              <div className="title">
                <div className="title-dot"></div>
                <div className="title-text">Confirmed Cases</div>
              </div>
              <div className="cases-number">
                {new Intl.NumberFormat("en-GB").format(
                  get(selectedCountry, "confirmed", 0)
                )}
              </div>
            </div>
            <div className="meter">
              <div
                className="ink-bar"
                style={{ width: getInkPercentage("confirmed") }}
              ></div>
            </div>
          </div>
          <div className="meter-section recovered">
            <div className="upper-section">
              <div className="title">
                <div className="title-dot"></div>
                <div className="title-text">Recovered Cases</div>
              </div>
              <div className="cases-number">
                {new Intl.NumberFormat("en-GB").format(
                  get(selectedCountry, "recovered", 0)
                )}
              </div>
            </div>
            <div className="meter">
              <div
                className="ink-bar"
                style={{ width: getInkPercentage("recovered") }}
              ></div>
            </div>
          </div>
          <div className="meter-section deaths">
            <div className="upper-section">
              <div className="title">
                <div className="title-dot"></div>
                <div className="title-text">Fatal Cases</div>
              </div>
              <div className="cases-number">
                {new Intl.NumberFormat("en-GB").format(
                  get(selectedCountry, "deaths", 0)
                )}
              </div>
            </div>
            <div className="meter">
              <div
                className="ink-bar"
                style={{ width: getInkPercentage("deaths") }}
              ></div>
            </div>
          </div>
        </section>
        <style jsx>{`
          .meter-section {
            display: flex;
            flex-direction: column;
            margin-top: 20px;
          }
          .meter {
            width: 100%;
            height: 5px;
            border-radius: 3px;
            margin-top: 10px;
            position: relative;
          }
          .meter .ink-bar {
            height: 5px;
            border-radius: 3px;
            position: absolute;
            top: 0;
            left: 0;
            transition: all 0.2s;
          }
          .meter-section.confirmed .meter {
            background: rgba(68, 133, 253, 0.12);
          }
          .meter-section.confirmed .meter .ink-bar {
            background: ${variables.blue};
          }
          .meter-section.recovered .meter {
            background: rgba(255, 183, 76, 0.12);
          }
          .meter-section.recovered .meter .ink-bar {
            background: ${variables.canary};
          }
          .meter-section.deaths .meter {
            background: rgba(165, 132, 255, 0.12);
          }
          .meter-section.deaths .meter .ink-bar {
            background: ${variables.purple};
          }
          .upper-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .meter-section .title {
            display: flex;
            align-items: center;
          }
          .meter-section .title .title-dot {
            width: 10px;
            height: 10px;
            border-radius: 1px;
            background: ${variables.blue};
          }
          .meter-section.recovered .title .title-dot {
            background: ${variables.canary};
          }

          .meter-section.deaths .title .title-dot {
            background: ${variables.purple};
          }
          .meter-section .title .title-text {
            margin-left: 10px;
            font-size: 14px;
          }
          .meter-section .cases-number {
            font-size: 14px;
          }

          img.flag-icon {
            height: 25px;
          }
          .country-name {
            padding-left: 20px;
            font-weight: 400;
            margin: 0;
          }
          .country-info {
            display: flex;
            align-items: center;
            margin-top: 15px;
          }
          .bottom-sheet {
            display: grid;
            grid-template-rows: min-content min-content min-content min-content min-content;
            grid-row-gap: 12px;
            background: white;
            border-top-right-radius: 52px;
            border-top-left-radius: 52px;
            height: 45vh;
            position: fixed;
            bottom: 0;
            overflow-y: auto;
            width: 100vw;
            padding: 35px 30px 10px 30px;
          }
          .bottom-sheet h3 {
            margin: 0;
            font-weight: 500;
          }
          .container {
            min-height: 100vh;
            padding: 0;
          }

          main {
            padding: 0;
            width: 100vw;
            height: 55vh;
          }

          @media (max-width: 600px) {
            .grid {
              width: 100%;
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </Shell>
  );
};

export function getCasesData(jsonDataString: string) {
  let result = [];
  try {
    const jsonData = JSON.parse(jsonDataString);
    const data = get(jsonData[jsonData.length - 1], "list");
    result = data.map(datum => ({ ...datum, value: datum.confirmed }));
  } catch (e) {
    console.error("Error parsing the result", e);
  }
  return result;
}

export async function fetchCasesData() {
  const res = await fetch(
    "https://covid.amcharts.com/data/js/world_timeline.js"
  );
  const data = await res.text();
  const jsonDataMatch = data.match(/^[^\[]+(.*)$/);
  const jsonData = jsonDataMatch ? jsonDataMatch[1] : "[]";
  return jsonData;
}

export async function fetchTotalData() {
  const res = await fetch(
    "https://covid.amcharts.com/data/js/total_timeline.js"
  );
  const data = await res.text();
  const jsonDataMatch = data.match(/^[^\[]+(.*)$/);
  const jsonData = jsonDataMatch ? jsonDataMatch[1] : "[]";
  return JSON.parse(jsonData);
}

export async function getStaticProps() {
  const casesJSONData = await fetchCasesData();
  const totalJSONData = await fetchTotalData();
  return {
    props: {
      data: getCasesData(casesJSONData),
      totalData: totalJSONData[totalJSONData.length - 1]
    }
  };
}

export default Home;
