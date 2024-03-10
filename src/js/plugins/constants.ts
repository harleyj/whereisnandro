export const courses = [
	{ value: "COURSE1", campus: "", title: "Course 1 description" },
	{ value: "COURSE2", campus: "", title: "Course 2 description" },
	{ value: "COURSE3", campus: "", title: "Course 3 description" },
// Filter out duplicate courses
].sort((a, b) => a.title.localeCompare(b.title)).filter((course, index, self) => index === self.findIndex((t) => (t.value === course.value)));