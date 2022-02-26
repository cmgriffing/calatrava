import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";
import BigText from "ink-big-text";
import TextInput from "ink-text-input";
import Gradient from "ink-gradient";
import SelectInput from "ink-select-input";
import Spinner from "ink-spinner";
import Case from "case";
import { scaffoldBoilerplate } from "@calatrava/boilerplate";

export const CLI = () => {
  const [name, setName] = useState("");
  const [settingName, setSettingName] = useState(true);

  const [description, setDescription] = useState("");
  const [settingDescription, setSettingDescription] = useState(false);

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
      console.log("scaffolding", {
        scaffoldBoilerplate,
        name,
        hasWebSocketSupport: hasWebSocketSupport ?? false,
        description,
        outputFolder,
      });
      scaffoldBoilerplate({
        name,
        hasWebSocketSupport: hasWebSocketSupport ?? false,
        description,
        outputFolder,
      }).then(() => {
        setTimeout(() => {
          setScaffoldingProject(false);
          setFinished(true);
        }, 2000);
      });
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
                setSettingDescription(true);
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

      {settingDescription && !settingName && (
        <Box>
          <Box marginRight={1}>
            <Text>Enter a description:</Text>
          </Box>
          <TextInput
            value={description}
            onChange={setDescription}
            onSubmit={() => {
              if (description === "") {
                // console.error("Description must not be empty");

                setError("Description must not be empty.");

                setTimeout(() => {
                  process.exit(-1);
                }, 0);
              } else {
                setSettingDescription(false);
                setSettingWebSocketSupport(true);
              }
            }}
          />
        </Box>
      )}

      {!settingDescription && !!description && (
        <Box>
          <Box marginRight={1}>
            <Text>Description:</Text>
          </Box>
          <Text>{description}</Text>
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
