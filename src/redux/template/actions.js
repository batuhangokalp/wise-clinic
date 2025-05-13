import {
  FETCH_TEMPLATES_REQUEST,
  FETCH_TEMPLATES_SUCCESS,
  FETCH_TEMPLATES_FAILURE,
  FETCH_TEMPLATE_BY_ID_REQUEST,
  FETCH_TEMPLATE_BY_ID_SUCCESS,
  FETCH_TEMPLATE_BY_ID_FAILURE,
  SET_SELECTED_TEMPLATE,
  FETCH_CANNED_RESPONSES_REQUEST,
  FETCH_CANNED_RESPONSES_SUCCESS,
  FETCH_CANNED_RESPONSES_FAILURE,
  FETCH_CANNED_RESPONSE_BY_ID_REQUEST,
  FETCH_CANNED_RESPONSE_BY_ID_SUCCESS,
  FETCH_CANNED_RESPONSE_BY_ID_FAILURE,
  SET_SELECTED_CANNED_RESPONSE,
  API_SUCCESS,
  API_ERROR,
  CREATE_TEMPLATE,
  UPDATE_TEMPLATE,
  DELETE_TEMPLATE,
  CREATE_CANNED_RESPONSE,
  UPDATE_CANNED_RESPONSE,
  DELETE_CANNED_RESPONSE,
} from "./constants";

export const fetchTemplatesRequest = () => ({
  type: FETCH_TEMPLATES_REQUEST,
});

export const fetchTemplatesSuccess = (templates) => ({
  type: FETCH_TEMPLATES_SUCCESS,
  payload: templates,
});

export const fetchTemplatesFailure = (error) => ({
  type: FETCH_TEMPLATES_FAILURE,
  payload: error,
});

export const fetchTemplateByIdRequest = () => ({
  type: FETCH_TEMPLATE_BY_ID_REQUEST,
});

export const fetchTemplateByIdSuccess = (template) => ({
  type: FETCH_TEMPLATE_BY_ID_SUCCESS,
  payload: template,
});

export const fetchTemplateByIdFailure = (error) => ({
  type: FETCH_TEMPLATE_BY_ID_FAILURE,
  payload: error,
});

export const setSelectedTemplate = (template) => ({
  type: SET_SELECTED_TEMPLATE,
  payload: template,
});

export const fetchCannedResponsesRequest = () => ({
  type: FETCH_CANNED_RESPONSES_REQUEST,
});

export const fetchCannedResponsesSuccess = (cannedResponses) => ({
  type: FETCH_CANNED_RESPONSES_SUCCESS,
  payload: cannedResponses,
});

export const fetchCannedResponsesFailure = (error) => ({
  type: FETCH_CANNED_RESPONSES_FAILURE,
  payload: error,
});

export const fetchCannedResponseByIdRequest = () => ({
  type: FETCH_CANNED_RESPONSE_BY_ID_REQUEST,
});

export const fetchCannedResponseByIdSuccess = (cannedResponse) => ({
  type: FETCH_CANNED_RESPONSE_BY_ID_SUCCESS,
  payload: cannedResponse,
});

export const fetchCannedResponseByIdFailure = (error) => ({
  type: FETCH_CANNED_RESPONSE_BY_ID_FAILURE,
  payload: error,
});

export const setSelectedCannedResponse = (cannedResponse) => ({
  type: SET_SELECTED_CANNED_RESPONSE,
  payload: cannedResponse,
});

export const createTemplateAction = (template) => ({
  type: CREATE_TEMPLATE,
  payload: template,
});

export const updateTemplateAction = (template) => ({
  type: UPDATE_TEMPLATE,
  payload: template,
});

export const deleteTemplateAction = (template) => ({
  type: DELETE_TEMPLATE,
  payload: template,
});

export const createCannedResponseAction = (cannedResponse) => ({
  type: CREATE_CANNED_RESPONSE,
  payload: cannedResponse,
});

export const updateCannedResponseAction = (cannedResponse) => ({
  type: UPDATE_CANNED_RESPONSE,
  payload: cannedResponse,
});

export const deleteCannedResponseAction = (cannedResponse) => ({
  type: DELETE_CANNED_RESPONSE,
  payload: cannedResponse,
});

export const apiTemplateError = (error) => ({
  type: API_ERROR,
  payload: error,
});

export const apiTemplateSuccess = (success) => ({
  type: API_SUCCESS,
  payload: success,
});

export const fetchTemplateById = (id) => {
  return async (dispatch) => {
    dispatch(fetchTemplateByIdRequest());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/templates/${id}`,
        {
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();
      dispatch(fetchTemplateByIdSuccess(data?.template));
    } catch (error) {
      dispatch(fetchTemplateByIdFailure(error.message));
    }
  };
};

export const fetchCannedResponses = () => {
  return async (dispatch) => {
    dispatch(fetchCannedResponsesRequest());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/canned-responses`,
        {
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();
      dispatch(fetchCannedResponsesSuccess(data?.cannedResponses));
    } catch (error) {
      dispatch(fetchCannedResponsesFailure(error.message));
    }
  };
};

export const fetchCannedResponseById = (id) => {
  return async (dispatch) => {
    dispatch(fetchCannedResponseByIdRequest());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/canned-responses/${id}`,
        {
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();
      dispatch(fetchCannedResponseByIdSuccess(data?.cannedResponse));
    } catch (error) {
      dispatch(fetchCannedResponseByIdFailure(error.message));
    }
  };
};

const extractVariableKeys = (text) => {
  return [...text.matchAll(/{{(.*?)}}/g)].map((m) => m[1]);
};

function injectExampleValues(text, variables) {
  if (!text) return text;

  const varNames = [...text.matchAll(/{{(.*?)}}/g)].map(m => m[1]);
  let example = text;
  varNames.forEach((name) => {
    example = example.replace(`{{${name}}}`, `example_${name}`);
  });
  return example;
}


const formatTemplateForAPI = (template) => {
  const exampleMap = {};

  if (template.contentVariable) {
    extractVariableKeys(template.contentVariable).forEach((key) => {
      exampleMap[key] = `example_${key}`;
    });
  }

  // Eğer contentVariable varsa, direkt kullan, yoksa example ile aynı olsun
  const contentForAPI = template.contentVariable || template.content;
  const headerForAPI = template.headerVariable || template.header;

  const apiBody = {
    category: template.category,
    template_type: template.template_type,
    element_name: template.element_name,
    language_code: template.language_code,
    vertical: template.element_name,
    header: headerForAPI || "",  
    content: contentForAPI, 
    footer: template.footer || "",
    example: injectExampleValues(contentForAPI, exampleMap), 
    example_header: injectExampleValues(headerForAPI, exampleMap),
    allow_template_category_change: false,
  };

  if (template.buttons?.length > 0) {
    apiBody.buttons = JSON.stringify(template.buttons);
  }

  return apiBody;
};



export const createTemplate = (template) => {
  console.log("template", template);
  const apiBody = formatTemplateForAPI(template);

  console.log("API BODY", apiBody);
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/templates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "ngrok-skip-browser-warning": 69420,
          },
          body: JSON.stringify(apiBody),
        }
      );

      const data = await response.json();

      if (response?.status !== 200 && response?.status !== 201) {
        throw data;
      }

      dispatch(createTemplateAction(data?.template));
      dispatch(apiTemplateSuccess("Template created successfully"));
      return data?.template;
    } catch (error) {
      dispatch(apiTemplateError(error.error));
    }
  };
};

export const updateTemplate = (template) => {
  template.allow_template_category_change = false;
  template.vertical = template.element_name;
  if (!template.contentVariable) {
    template.example = template.content;
  }
  if (!template.headerVariable) {
    template.example_header = template.header;
  }
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/templates/${template.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
          body: JSON.stringify(template),
        }
      );
      const data = await response.json();

      if (response?.status !== 200 && response?.status !== 201) {
        throw data;
      }
      dispatch(updateTemplateAction(data?.template));
      dispatch(apiTemplateSuccess("Template updated successfully"));
      return data?.template;
    } catch (error) {
      dispatch(apiTemplateError(error.error));
    }
  };
};

export const deleteTemplate = (templateId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/templates/${templateId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();

      if (response?.status !== 200 && response?.status !== 201) {
        throw data;
      }
      dispatch(deleteTemplateAction(templateId));
      dispatch(apiTemplateSuccess("Template deleted successfully"));
      return data;
    } catch (error) {
      dispatch(apiTemplateError(error.error));
    }
  };
};

export const createCannedResponse = (cannedResponse) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/canned-responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
          body: JSON.stringify(cannedResponse),
        }
      );
      const data = await response.json();

      if (response?.status !== 200 && response?.status !== 201) {
        throw data;
      }
      dispatch(createCannedResponseAction(data?.cannedResponse));
      dispatch(apiTemplateSuccess("Canned Response created successfully"));
      return data?.cannedResponse;
    } catch (error) {
      dispatch(apiTemplateError(error.error));
    }
  };
};

export const updateCannedResponse = (cannedResponse) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/canned-responses/${cannedResponse.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
          body: JSON.stringify(cannedResponse),
        }
      );
      const data = await response.json();

      if (response?.status !== 200 && response?.status !== 201) {
        throw data;
      }
      dispatch(updateCannedResponseAction(data?.cannedResponse));
      dispatch(apiTemplateSuccess("Canned Response updated successfully"));
      return data?.cannedResponse;
    } catch (error) {
      dispatch(apiTemplateError(error.error));
    }
  };
};

export const deleteCannedResponse = (cannedResponseId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/canned-responses/${cannedResponseId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();

      if (response?.status !== 200 && response?.status !== 201) {
        throw data;
      }
      dispatch(deleteCannedResponseAction(cannedResponseId));
      dispatch(apiTemplateSuccess("Canned Response deleted successfully"));
      return data;
    } catch (error) {
      dispatch(apiTemplateError(error.error));
    }
  };
};

export const fetchTemplates = () => {
  return async (dispatch) => {
    dispatch(fetchTemplatesRequest());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/templates`,
        {
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();
      dispatch(fetchTemplatesSuccess(data?.templates));
    } catch (error) {
      dispatch(fetchTemplatesFailure(error.message));
    }
  };
};
