import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

const sidebarSections = [
  {
    key: "offers",
    label: "Offers",
    tabs: [
      { key: "create", label: "Create" },
      { key: "import", label: "Import" },
      { key: "export", label: "Export" },
    ],
  },
  {
    key: "products",
    label: "Products",
    tabs: [
      { key: "list", label: "List" },
      { key: "add", label: "Add New" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    tabs: [
      { key: "profile", label: "Profile" },
      { key: "preferences", label: "Preferences" },
    ],
  },
];

export default function SidebarTabsDemo() {
  const [activeSection, setActiveSection] = React.useState(sidebarSections[0].key);
  const section = sidebarSections.find((s) => s.key === activeSection)!;
  const [activeTab, setActiveTab] = React.useState(section.tabs[0].key);

  React.useEffect(() => {
    setActiveTab(section.tabs[0].key);
  }, [activeSection]);

  return (
    <div className="flex h-[80vh] w-full max-w-5xl mx-auto bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      {/* Sidebar */}
      <aside className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col py-6 px-2">
        <h2 className="text-lg font-bold mb-6 text-red-600">Main</h2>
        <nav className="flex flex-col gap-2">
          {sidebarSections.map((s) => (
            <button
              key={s.key}
              className={`text-left px-4 py-2 rounded font-medium transition-colors ${activeSection === s.key ? "bg-red-100 text-red-700" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => setActiveSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-700">{section.label}</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {section.tabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {section.tabs.map((tab) => (
            <TabsContent key={tab.key} value={tab.key}>
              <div className="p-6 bg-gray-50 rounded shadow-inner border border-gray-200">
                <span className="font-semibold text-gray-700">{section.label} / {tab.label}</span>
                <div className="mt-2 text-gray-500">This is the <b>{tab.label}</b> tab in <b>{section.label}</b> section.</div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
