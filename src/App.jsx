import React from "react";
import { Formik, Form, Field } from "formik";
import { DataItems } from "./data/data"; // Replace with your actual import path

const App = () => {
  // Group items by category
  const groupedItems = DataItems.reduce((acc, item) => {
    const categoryName = item.category?.name || "No Category";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Add Tax</h2>
      <Formik
        initialValues={{ selectedItems: [] }}
        onSubmit={(values) => {
          const applied_to =
            values.selectedItems.length === DataItems.length ? "all" : "some";
          console.log({ applied_to, applicable_items: values.selectedItems });
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-4">
            <div className="flex items-center space-x-2">
              <Field
                type="text"
                name="taxName"
                className="p-2 border rounded w-2/3"
                placeholder="Enter tax name"
              />
              <Field
                type="number"
                name="taxPercentage"
                className="p-2 border rounded w-20"
                placeholder="4"
              />
              <span className="text-xl">%</span>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <Field type="radio" name="applyTo" value="all" />
                <span>Apply to all items in collection</span>
              </label>
              <label className="flex items-center space-x-2">
                <Field type="radio" name="applyTo" value="specific" />
                <span>Apply to specific items</span>
              </label>
            </div>

            <div className="border p-4 rounded-lg">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <label className="flex items-center space-x-2">
                    <Field
                      type="checkbox"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        let updatedItems;
                        if (isChecked) {
                          updatedItems = [
                            ...values.selectedItems,
                            ...items.map((item) => item.id),
                          ];
                        } else {
                          updatedItems = values.selectedItems.filter(
                            (id) => !items.some((item) => item.id === id)
                          );
                        }
                        setFieldValue("selectedItems", updatedItems);
                      }}
                      checked={items.every(item =>
                        values.selectedItems.includes(item.id)
                      )}
                    />
                    <span
                      className={`${
                        category !== "No Category"
                          ? "bg-gray-200"
                          : "bg-transparent"
                      } p-2 rounded`}
                    >
                      {category}
                    </span>
                  </label>
                  <div className="ml-6 space-y-1">
                    {items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center space-x-2"
                      >
                        <Field
                          type="checkbox"
                          name="selectedItems"
                          value={item.id}
                          checked={values.selectedItems.includes(item.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            let updatedItems;
                            if (isChecked) {
                              updatedItems = [...values.selectedItems, item.id];
                            } else {
                              updatedItems = values.selectedItems.filter(
                                (id) => id !== item.id
                              );
                            }
                            setFieldValue("selectedItems", updatedItems);
                          }}
                        />
                        <span>{item.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="bg-orange-500 text-white p-2 rounded"
            >
              Apply tax to {values.selectedItems.length} item(s)
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
