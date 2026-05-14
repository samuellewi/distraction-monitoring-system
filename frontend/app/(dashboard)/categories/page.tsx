"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://127.0.0.1:4000/api";

type CategoryType = "PRODUCTIVE" | "DISTRACTING" | "NEUTRAL";

type Category = {
  id: string;
  name: string;
  type: CategoryType;
};

type DeleteCategoryResponse = {
  id: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
    details?: {
      fieldErrors?: {
        name?: string[];
        type?: string[];
      };
    };
  };
};

function getCategoryErrorMessage<T>(result: ApiResponse<T>) {
  const fieldErrors = result.error?.details?.fieldErrors;
  const firstFieldError = fieldErrors?.name?.[0] || fieldErrors?.type?.[0];

  return firstFieldError || result.error?.message || "Unable to save category.";
}

function getCategoryTypeDisplay(type: CategoryType) {
  if (type === "PRODUCTIVE") {
    return {
      label: "Productive",
      className: "bg-green-100 text-green-600",
    };
  }

  if (type === "DISTRACTING") {
    return {
      label: "Distracting",
      className: "bg-red-100 text-red-500",
    };
  }

  return {
    label: "Neutral",
    className: "bg-gray-100 text-gray-600",
  };
}

async function requestCategory<T>(
  path: string,
  token: string,
  options: RequestInit = {},
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success || result.data === undefined) {
    throw new Error(getCategoryErrorMessage(result));
  }

  return result.data;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [apps, setApps] = useState<Category[]>([]);
  const [newApp, setNewApp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const productiveCount = apps.filter(app => app.type === "PRODUCTIVE").length;
  const distractingCount = apps.filter(app => app.type === "DISTRACTING").length;

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function loadCategories() {
      setIsLoading(true);
      setError("");

      try {
        const categories = await requestCategory<Category[]>("/categories", token);
        setApps(categories);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to load categories.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, [router]);

  async function addApp() {
    const appName = newApp.trim();
    const token = localStorage.getItem("authToken");

    if (!appName || isSaving) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const createdCategory = await requestCategory<Category>("/categories", token, {
        method: "POST",
        body: JSON.stringify({
          name: appName,
          type: "DISTRACTING",
        }),
      });

      setApps((currentApps) => [...currentApps, createdCategory]);
      setNewApp("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to add app.");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleApp(app: Category) {
    const token = localStorage.getItem("authToken");
    const nextType = app.type === "PRODUCTIVE" ? "DISTRACTING" : "PRODUCTIVE";

    if (!token) {
      router.replace("/login");
      return;
    }

    setError("");

    try {
      const updatedCategory = await requestCategory<Category>(
        `/categories/${app.id}`,
        token,
        {
          method: "PUT",
          body: JSON.stringify({ type: nextType }),
        },
      );

      setApps((currentApps) =>
        currentApps.map((currentApp) =>
          currentApp.id === updatedCategory.id ? updatedCategory : currentApp,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update category.",
      );
    }
  }

  async function deleteApp(app: Category) {
    const shouldDelete = window.confirm(`Delete ${app.name}?`);

    if (!shouldDelete) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    setError("");

    try {
      const deletedCategory = await requestCategory<DeleteCategoryResponse>(
        `/categories/${app.id}`,
        token,
        {
          method: "DELETE",
        },
      );

      setApps((currentApps) =>
        currentApps.filter((currentApp) => currentApp.id !== deletedCategory.id),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete category.",
      );
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Add app name..."
          value={newApp}
          onChange={(e) => setNewApp(e.target.value)}
          className="border rounded-lg px-4 py-3 outline-none flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addApp();
            }
          }}
        />

        <button
          type="button"
          onClick={addApp}
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Adding..." : "+ Add App"}
        </button>
      </div>

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">App Classification</h1>
        <p className="text-sm text-gray-500">
          Choose which apps are productive or distracting
        </p>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl border p-4 space-y-3">
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading apps...</p>
        ) : null}

        {!isLoading && apps.length === 0 ? (
          <p className="text-sm text-gray-500">No apps added yet.</p>
        ) : null}

        {apps.map((app) => {
          const typeDisplay = getCategoryTypeDisplay(app.type);

          return (
            <div
              key={app.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="font-medium">{app.name}</span>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${typeDisplay.className}`}
                >
                  {typeDisplay.label}
                </span>

                <button
                  type="button"
                  onClick={() => toggleApp(app)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                    app.type === "PRODUCTIVE" ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
                      app.type === "PRODUCTIVE" ? "translate-x-6" : ""
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => deleteApp(app)}
                  className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white p-5 rounded-xl border">
        <h2 className="font-semibold mb-3">Summary</h2>

        <div className="flex gap-6 text-sm text-gray-600">
          <p>
            Productive Apps:{" "}
            <span className="font-medium text-green-600">
              {productiveCount}
            </span>
          </p>

          <p>
            Distracting Apps:{" "}
            <span className="font-medium text-red-500">
              {distractingCount}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
