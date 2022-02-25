import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    image: "/img/ease.svg",
    description: (
      <>
        The main goal is to get out of the way and let you get work done.
        Everything should be easy and mostly taken care of by the initial
        scaffolding.
      </>
    ),
  },
  {
    title: "Focus on What Matters",
    image: "/img/focus.svg",
    description: (
      <>
        Calatrava does its best to let you get to work on your API instead of
        making you set up the same old boilerplate repeatedly.
      </>
    ),
  },
  {
    title: "Powered by Architect",
    image: "/img/power.svg",
    description: (
      <>
        Allows Architect to do the heavy lifting for AWS stuff like Lambda,
        DynamoDB, API Gateway, and more.
      </>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img
          className={styles.featureSvg}
          alt={title}
          src={useBaseUrl(image)}
        />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
