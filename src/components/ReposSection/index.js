import React from "react";
import Section from "./../Section";
import SectionHeader from "./../SectionHeader";
import "./styles.scss";

function ReposSection(props) {

  return (
    <Section color={props.color} size={props.size}>
      <div className="container">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          centered={true}
          size={3}
        />
        <div>{props.user}</div>
        <div>{props.idToken}</div>
        <ol>
          {props.repos.map(repo => (
            <li key={repo.name}>{repo.name}</li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export default ReposSection;
