const getLessons = async (librusApi) => {
  const prev = await librusApi.getTimetablesPrev();
  const current = await librusApi.getTimetables();
  const next = await librusApi.getTimetablesNext();

  return [
    ...proccessLessonTimetable(prev.Timetable),
    ...proccessLessonTimetable(current.Timetable),
    ...proccessLessonTimetable(next.Timetable),
  ];
};

const proccessLessonTimetable = (timetable) => {
  let entries = [];

  Object.entries(timetable).forEach(([key, value]) => {
    const date = key.split("-").map((x) => parseInt(x));
    value.forEach((events) => {
      events.forEach((event) => {
        const subject = event.Subject.Name;
        const start = [
          ...date,
          ...event.HourFrom.split(":").map((x) => parseInt(x)),
        ];
        const end = [
          ...date,
          ...event.HourTo.split(":").map((x) => parseInt(x)),
        ];

        entries.push({
          title: subject,
          start: start,
          end: end,
        });
      });
    });
  });

  return entries;
};

const getEvents = async (librusApi) => {
  const rawCategories = await librusApi.getHomeWorksCategories();
  const categories = {};
  rawCategories.Categories.forEach((category) => {
    categories[category.Id] = category.Name;
  });

  const rawSubjects = await librusApi.getSubjects();
  const subjects = {};
  rawSubjects.Subjects.forEach((subject) => {
    subjects[subject.Id] = subject;
  });

  const homeworks = (await librusApi.getHomeWorks()).HomeWorks;
  const events = [];

  homeworks.forEach((homework) => {
    const date = homework.Date.split("-").map((x) => parseInt(x));
    const start = [
      ...date,
      ...homework.TimeFrom.split(":").map((x) => parseInt(x)),
    ];
    const end = [
      ...date,
      ...homework.TimeTo.split(":").map((x) => parseInt(x)),
    ];

    events.push({
      title:
        categories[homework.Category.Id] +
        (homework.Subject ? " - " + subjects[homework.Subject.Id].Name : ""),
      // description:
      //   (homework.Subject ? subjects[homework.Subject.Id].Name + " - " : "") +
      //   homework.Content,
      description: homework.Content,
      start: start,
      end: end,
    });
  });

  return events;
};

module.exports = {
  getLessons,
  getEvents,
};
