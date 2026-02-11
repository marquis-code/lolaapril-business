// 1. Add these helpers and state at the top of your component (after useState imports):

// Helper to deep clone and normalize sections for editing
function deepCloneSections(sectionsToClone) {
  return sectionsToClone.map((section) => ({
    ...section,
    id: section.id || section._id || Date.now() + Math.random(),
    sub: Array.isArray(section.sub)
      ? section.sub.map((subItem) => ({
          ...subItem,
          id: subItem.id || subItem._id || Date.now() + Math.random(),
          options: Array.isArray(subItem.options)
            ? subItem.options.map((opt, idx) =>
                typeof opt === "string"
                  ? { id: Date.now() + Math.random() + idx, text: opt, checked: false }
                  : { ...opt, id: opt.id || Date.now() + Math.random() }
              )
            : [],
        }))
      : [],
  }));
}

// Editable template fields
const handleSectionTitleChange = (sIndex, value) => {
  setSections((prev) => {
    const updated = [...prev];
    updated[sIndex] = { ...updated[sIndex], title: value };
    return updated;
  });
};
const handleSubTitleChange = (sIndex, subIndex, value) => {
  setSections((prev) => {
    const updated = [...prev];
    updated[sIndex] = {
      ...updated[sIndex],
      sub: updated[sIndex].sub.map((sub, idx) =>
        idx === subIndex ? { ...sub, subTitle: value } : sub
      ),
    };
    return updated;
  });
};
const handleOptionTextChange = (sIndex, subIndex, oIndex, value) => {
  setSections((prev) => {
    const updated = [...prev];
    updated[sIndex] = {
      ...updated[sIndex],
      sub: updated[sIndex].sub.map((sub, idx) =>
        idx === subIndex
          ? {
              ...sub,
              options: sub.options.map((opt, optIdx) =>
                optIdx === oIndex ? { ...opt, text: value } : opt
              ),
            }
          : sub
      ),
    };
    return updated;
  });
};
const addSection = () => {
  setSections((prev) => [
    ...prev,
    {
      id: Date.now() + Math.random(),
      title: "",
      sub: [
        {
          id: Date.now() + Math.random(),
          subTitle: "",
          options: [
            { id: Date.now() + Math.random(), text: "", checked: false },
            { id: Date.now() + Math.random(), text: "", checked: false },
          ],
        },
      ],
    },
  ]);
};
const addSubSection = (sIndex) => {
  setSections((prev) => {
    const updated = [...prev];
    updated[sIndex] = {
      ...updated[sIndex],
      sub: [
        ...updated[sIndex].sub,
        {
          id: Date.now() + Math.random(),
          subTitle: "",
          options: [
            { id: Date.now() + Math.random(), text: "", checked: false },
            { id: Date.now() + Math.random(), text: "", checked: false },
          ],
        },
      ],
    };
    return updated;
  });
};
const addOption = (sIndex, subIndex) => {
  setSections((prev) => {
    const updated = [...prev];
    updated[sIndex] = {
      ...updated[sIndex],
      sub: updated[sIndex].sub.map((sub, idx) =>
        idx === subIndex
          ? {
              ...sub,
              options: [
                ...sub.options,
                { id: Date.now() + Math.random(), text: "", checked: false },
              ],
            }
          : sub
      ),
    };
    return updated;
  });
};

// 2. In your useEffect that loads the chore, normalize the sections for editing:
useEffect(() => {
  getFetch(`/chores/single-chore/${id}`).then((response) => {
    const responseData = response?.data?.data;
    // ...existing code...
    if (responseData?.sections && responseData?.template_note) {
      setIsTemplateChore(true);
      // Normalize options for editing
      const normalizedSections = responseData.sections.map((section) => ({
        ...section,
        sub: Array.isArray(section.sub)
          ? section.sub.map((sub) => ({
              ...sub,
              options: Array.isArray(sub.options)
                ? sub.options.map((opt) =>
                    typeof opt === "string"
                      ? { id: Date.now() + Math.random(), text: opt, checked: false }
                      : opt
                  )
                : [],
            }))
          : [],
      }));
      setSections(deepCloneSections(normalizedSections));
      setTemplateNote(responseData.template_note || "");
    } else {
      setIsTemplateChore(false);
      setSections([]);
      setTemplateNote("");
    }
  });
}, [id]);

// 3. Replace your template UI rendering with this (inside your return, where you currently render the template preview):

{isTemplateChore && sections.length > 0 && (
  <div className="bg-gray-50 p-4 border border-gray-200 rounded-md mt-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-medium text-base text-black">Template Sections</h3>
      <button
        type="button"
        className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md font-semibold text-sm hover:bg-blue-200"
        onClick={addSection}
      >
        Add Section
      </button>
    </div>
    <div className="p-3 text-start rounded-xl bg-[#FFF9E6] border border-[#FFD700] mt-4">
      <h3 className="text-[#272727] text-sm font-semibold">Template Note</h3>
      <textarea
        className="w-full text-gray-600 bg-transparent rounded-md border border-gray-400 px-3 py-3 text-sm outline-none focus:border-[#91c8f2] resize-none mt-2"
        value={templateNote}
        onChange={e => setTemplateNote(e.target.value)}
        placeholder="Add a note to describe this template or provide instructions for staff..."
      />
    </div>
    <div className="mt-8 space-y-12">
      {sections.map((section, sIndex) => (
        <div key={section.id || sIndex} className="bg-white rounded-2xl p-4 border border-[#F0F0F0] shadow-sm relative">
          <div className="bg-[#E7F0FC] border-blue-600 border w-28 text-center py-1.5 rounded-lg absolute -top-5 text-sm">
            Section {sIndex + 1}
          </div>
          <div className="mt-4">
            <div className="font-medium text-gray-700">
              <p className="pl-[2px] text-sm">Title of section</p>
              <div className="rounded-md flex items-center bg-white border border-gray-300 overflow-hidden py-2 mt-1">
                <input
                  type="text"
                  value={section.title}
                  onChange={e => handleSectionTitleChange(sIndex, e.target.value)}
                  className="outline-none border-none w-full px-3 py-[2px] text-sm"
                />
              </div>
            </div>
            {Array.isArray(section.sub) &&
              section.sub.map((subSection, subIndex) => (
                <div key={subSection.id || subIndex} className="mt-4 text-[13px]">
                  <div className="rounded-md flex items-center bg-white border border-gray-300 overflow-hidden py-2">
                    <input
                      type="text"
                      value={subSection.subTitle}
                      onChange={e => handleSubTitleChange(sIndex, subIndex, e.target.value)}
                      className="outline-none border-none w-full px-3 py-[2px]"
                      placeholder={`Optional subtitle`}
                    />
                  </div>
                  {Array.isArray(subSection.options) &&
                    subSection.options.map((option, oIndex) => (
                      <div key={option.id || oIndex} className="mt-3">
                        <div className="flex items-center justify-between px-3 py-1 gap-4">
                          <div>
                            {option.checked ? (
                              <span className="inline-block w-5 h-5 bg-blue-500 rounded text-white text-center">✓</span>
                            ) : (
                              <span className="inline-block w-5 h-5 bg-gray-300 rounded text-white text-center"> </span>
                            )}
                          </div>
                          <div className="rounded-md flex items-center bg-white border border-gray-300 overflow-hidden py-1 w-full">
                            <input
                              type="text"
                              value={option.text}
                              onChange={e => handleOptionTextChange(sIndex, subIndex, oIndex, e.target.value)}
                              className="outline-none border-none w-full px-3 py-[2px] text-sm"
                              placeholder={`Option ${oIndex + 1}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="mt-3 flex items-center gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addOption(sIndex, subIndex)}
                      className="text-[#0C6DE4] p-2 flex gap-2 items-center cursor-pointer text-sm"
                    >
                      Add More Option
                    </button>
                  </div>
                </div>
              ))}
            <div className="mt-3 flex items-center gap-4 flex-wrap border-t pt-3">
              <button
                type="button"
                onClick={() => addSubSection(sIndex)}
                className="bg-white w-fit rounded-md cursor-pointer text-[#0C6DE4] p-2 flex gap-2 items-center text-sm"
              >
                Add Subtitle
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

// 4. In handleUpdateTask, if isTemplateChore, send the updated sections and template_note:
const handleUpdateTask = () => {
  setLoading(true);
  let payload = { ...data };
  if (isTemplateChore) {
    // Convert options back to string array for API if needed
    const transformedSections = sections.map((section) => ({
      ...section,
      sub: Array.isArray(section.sub)
        ? section.sub.map((sub) => ({
            ...sub,
            options: Array.isArray(sub.options)
              ? sub.options.map((opt) => opt.text)
              : [],
          }))
        : [],
    }));
    payload.sections = transformedSections;
    payload.template_note = templateNote;
  }
  putFetch(`/chores/update-chore/${id}`, payload)
    .then((response) => {
      if (response) {
        setLoading(false);
        toast.success(response?.data?.message);
        navigate(-1);
      }
    })
    .catch((error) => {
      setLoading(false);
      toast.error("Something went wrong");
    });
};
