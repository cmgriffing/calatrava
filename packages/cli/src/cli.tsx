#!/usr/bin/env node
import React, { useState, useEffect } from "react";
import { render, Text, Box } from "ink";
import BigText from "ink-big-text";
import TextInput from "ink-text-input";
import Gradient from "ink-gradient";
import SelectInput from "ink-select-input";
import Spinner from "ink-spinner";
import Case from "case";

const CLI = () => {
  const [name, setName] = useState("");
  const [settingName, setSettingName] = useState(true);

  const [hasWebSocketSupport, setHasWebSocketSupport] = useState<boolean>();
  const [settingHasWebSocketSupport, setSettingWebSocketSupport] =
    useState(false);

  const [outputFolder, setOutputFolder] = useState("");
  const [settingOutputFolder, setSettingOutputFolder] = useState(false);

  const [settingSettingsConfirmed, setSettingSettingsConfirmed] =
    useState(false);

  const [scaffoldingProject, setScaffoldingProject] = useState(false);

  const [finished, setFinished] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (scaffoldingProject) {
      setTimeout(() => {
        setScaffoldingProject(false);
        setFinished(true);
      }, 5000);
    }
  }, [scaffoldingProject]);

  useEffect(() => {
    if (finished) {
      setTimeout(() => {
        process.exit();
      }, 0);
    }
  }, [finished]);

  return (
    <>
      <Box alignItems="center" justifyContent="center">
        <Gradient name="retro">
          <BigText text="Calatrava" />
        </Gradient>
      </Box>

      <Box>
        <Text>
          Calatrava is a wrapper around Architect that adds some more
          functionality that is typically needed in full featured APIs.
          (validation, dynamoDB wrapper, OpenAPI documentation)
        </Text>
      </Box>

      {/* Get project name */}
      {settingName && (
        <Box>
          <Box marginRight={1}>
            <Text>Enter a name:</Text>
          </Box>
          <TextInput
            value={name}
            onChange={setName}
            onSubmit={() => {
              if (name === "") {
                // console.error("Name must not be empty");

                setError("Name must not be empty.");

                setTimeout(() => {
                  process.exit(-1);
                }, 0);
              } else {
                setSettingName(false);
                setSettingWebSocketSupport(true);
              }
            }}
          />
        </Box>
      )}

      {!settingName && (
        <Box>
          <Box marginRight={1}>
            <Text>Name:</Text>
          </Box>
          <Text>{name}</Text>
        </Box>
      )}

      {settingHasWebSocketSupport && (
        <Box>
          <Box marginRight={1}>
            <Text>Would you like to add WebSocket support?</Text>
          </Box>
          <SelectInput
            items={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            onSelect={(selectedItem) => {
              console.log({ selectedItem, hasWebSocketSupport });
              setHasWebSocketSupport(selectedItem.value);
              setSettingWebSocketSupport(false);
              setSettingOutputFolder(true);
            }}
          />
        </Box>
      )}

      {!settingHasWebSocketSupport && hasWebSocketSupport !== undefined && (
        <Box>
          <Box marginRight={1}>
            <Text>WebSockets?:</Text>
          </Box>
          <Text>{hasWebSocketSupport ? "Yes" : "No"}</Text>
        </Box>
      )}

      {settingOutputFolder && (
        <Box>
          <Box marginRight={1}>
            <Text>Output folder:</Text>
          </Box>
          <TextInput
            placeholder={`./${Case.kebab(name)}`}
            value={outputFolder}
            onChange={setOutputFolder}
            onSubmit={() => {
              if (outputFolder === "") {
                setOutputFolder(Case.kebab(name));
              }

              setSettingOutputFolder(false);
              setSettingSettingsConfirmed(true);
            }}
          />
        </Box>
      )}

      {!settingName && !settingOutputFolder && !!outputFolder && (
        <Box>
          <Box marginRight={1}>
            <Text>Output folder:</Text>
          </Box>
          <Text>{outputFolder}</Text>
        </Box>
      )}

      {/* Confirm settings */}

      {settingSettingsConfirmed && (
        <Box>
          <Box marginRight={1}>
            <Text>Do the settings above look right?</Text>
          </Box>
          <SelectInput
            items={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            onSelect={(selectedItem) => {
              console.log({ selectedItem, hasWebSocketSupport });
              // setSettingsConfirmed(selectedItem.value);
              setSettingSettingsConfirmed(false);
              if (selectedItem.value) {
                setSettingOutputFolder(true);
                setScaffoldingProject(true);
              } else {
                console.log("settings unconfirmed. exiting for now");
                process.exit();
              }
            }}
          />
        </Box>
      )}

      {scaffoldingProject && (
        <Box>
          <Box marginRight={1}>
            <Text color="green">
              <Spinner type="dots" />
            </Text>
          </Box>
          <Text>Scaffolding</Text>
        </Box>
      )}

      {finished && <Text>Allllllll done!!!!</Text>}

      {!!error && (
        <Box>
          <Box marginRight={1}>
            <Text color="red">Error:</Text>
          </Box>
          <Text>{error}</Text>
        </Box>
      )}
    </>
  );
};

render(<CLI />);
