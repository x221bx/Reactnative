import React, { createContext, useContext, useMemo, useState } from "react";
import { teachers as seedTeachers } from "../api/teachers";
import { courses as seedCourses } from "../api/courses";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [teachers, setTeachers] = useState(() => [...seedTeachers]);
  const [courses, setCourses] = useState(() => [...seedCourses]);

  const addTeacher = (t) => setTeachers((s) => [{ ...t, id: t.id || `t_${Date.now()}` }, ...s]);
  const updateTeacher = (t) => setTeachers((s) => s.map((x) => (x.id === t.id ? { ...x, ...t } : x)));
  const removeTeacher = (id) => setTeachers((s) => s.filter((x) => x.id !== id));

  const addCourse = (c) => setCourses((s) => [{ ...c, id: c.id || `c_${Date.now()}` }, ...s]);
  const updateCourse = (c) => setCourses((s) => s.map((x) => (x.id === c.id ? { ...x, ...c } : x)));
  const removeCourse = (id) => setCourses((s) => s.filter((x) => x.id !== id));

  const value = useMemo(
    () => ({ teachers, courses, addTeacher, updateTeacher, removeTeacher, addCourse, updateCourse, removeCourse }),
    [teachers, courses]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

