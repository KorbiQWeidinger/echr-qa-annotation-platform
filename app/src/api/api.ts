import { AnnotationProgress, EvaluationBatch } from "@/models/annotation";
import { LoginCredentials } from "@/models/login-credentials";

export const createToken = async (credentials: LoginCredentials) => {
  const formData = new URLSearchParams();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  const response = await fetch("/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });
  const data = await response.json();
  if (response.ok) {
    return data as { access_token: string };
  } else {
    throw new Error(data.message || "Unable to login");
  }
};

export const fetchAnnotation = async (index: number) => {
  const token = localStorage.getItem("token");
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
  const response = await fetch(`/api/annotations/${index}`, {
    method: "GET",
    headers: headers,
  });
  if (response.status !== 200) {
    throw new Error("Unable to fetch annotation");
  }
  const data = await response.json();
  return data as EvaluationBatch;
};

export const fetchAnnotationProgress = async () => {
  const token = localStorage.getItem("token");
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
  const response = await fetch(`/api/annotations/completed`, {
    method: "GET",
    headers: headers,
  });
  if (response.status !== 200) {
    throw new Error("Unable to fetch annotation progress");
  }
  const data = await response.json();
  return data as AnnotationProgress;
};
