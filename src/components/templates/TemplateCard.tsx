<<<<<<< HEAD
"use client";

import EditTemplateModal from "./EditTemplateModal";
import { useState } from "react";

export default function TemplateCard({ template, onUpdated }: any) {
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    await fetch(`http://localhost:5000/api/templates/${template._id}`, {
      method: "DELETE",
    });
    onUpdated();
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow hover:shadow-lg transition">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-md font-bold text-[var(--text)]">
          {template.name}
        </h3>

        <span
          className={`text-[10px] px-2 py-1 rounded-full text-white ${
            template.category === "Marketing"
              ? "bg-emerald-600"
              : template.category === "Utility"
              ? "bg-blue-600"
              : "bg-purple-600"
          }`}
        >
          {template.category}
        </span>
      </div>

      {/* TEMPLATE CONTENT */}
      <p className="mt-2 text-[var(--text-muted)] text-sm">{template.content}</p>

      {/* LIVE PREVIEW BUBBLE */}
      <div className="mt-3 p-3 bg-[var(--surface-alt)] rounded-xl text-sm border border-[var(--border)]">
        {template.content.replace(/{{(.*?)}}/g, "🟦")}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setOpenEdit(true)}
          className="flex-1 px-3 py-1 bg-indigo-500 text-white rounded"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>

        <button
          onClick={async () => {
            await fetch("http://localhost:5000/api/templates", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: template.name + " (Copy)",
                category: template.category,
                content: template.content,
                variables: template.variables || [],
              }),
            });
            onUpdated();
          }}
          className="flex-1 px-3 py-1 bg-gray-500 text-white rounded"
        >
          Duplicate
        </button>
      </div>

      {/* EDIT MODAL */}
      {openEdit && (
        <EditTemplateModal
          template={template}
          onClose={() => {
            setOpenEdit(false);
            onUpdated();
          }}
        />
      )}
    </div>
  );
}
=======
"use client";

import EditTemplateModal from "./EditTemplateModal";
import { useState } from "react";

export default function TemplateCard({ template, onUpdated }: any) {
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    await fetch(`http://localhost:5000/api/templates/${template._id}`, {
      method: "DELETE",
    });
    onUpdated();
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow hover:shadow-lg transition">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-md font-bold text-[var(--text)]">
          {template.name}
        </h3>

        <span
          className={`text-[10px] px-2 py-1 rounded-full text-white ${
            template.category === "Marketing"
              ? "bg-emerald-600"
              : template.category === "Utility"
              ? "bg-blue-600"
              : "bg-purple-600"
          }`}
        >
          {template.category}
        </span>
      </div>

      {/* TEMPLATE CONTENT */}
      <p className="mt-2 text-[var(--text-muted)] text-sm">{template.content}</p>

      {/* LIVE PREVIEW BUBBLE */}
      <div className="mt-3 p-3 bg-[var(--surface-alt)] rounded-xl text-sm border border-[var(--border)]">
        {template.content.replace(/{{(.*?)}}/g, "🟦")}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setOpenEdit(true)}
          className="flex-1 px-3 py-1 bg-indigo-500 text-white rounded"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>

        <button
          onClick={async () => {
            await fetch("http://localhost:5000/api/templates", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: template.name + " (Copy)",
                category: template.category,
                content: template.content,
                variables: template.variables || [],
              }),
            });
            onUpdated();
          }}
          className="flex-1 px-3 py-1 bg-gray-500 text-white rounded"
        >
          Duplicate
        </button>
      </div>

      {/* EDIT MODAL */}
      {openEdit && (
        <EditTemplateModal
          template={template}
          onClose={() => {
            setOpenEdit(false);
            onUpdated();
          }}
        />
      )}
    </div>
  );
}
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
