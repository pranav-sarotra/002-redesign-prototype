import {
  INTERESTS,
  SCHOOLS,
  offersStage,
  stageForAge,
  yearGroupFor,
  type School,
} from "../data/schools";

export interface Chapter {
  title: string;
  blurb: string;
  note?: string;
}

const boardingNearby: Record<School["code"], string> = {
  KE: "Hillcrest (Karen), Braeburn Nanyuki and Braeside Thika",
  TZ: "Braeburn Arusha",
  RW: "Braeburn Arusha and Hillcrest in Nairobi",
};

export function buildChapters(school: School, age: number, interests: string[]): Chapter[] {
  const stage = stageForAge(age);
  const year = yearGroupFor(age);
  const chapters: Chapter[] = [];

  chapters.push({
    title: `Welcome to ${school.short}`,
    blurb: `A welcome from the Head, the story of the campus and why ${school.town} is a special place to grow up.`,
  });

  if (offersStage(school, stage)) {
    chapters.push({
      title: `${stage.label} at ${school.short}`,
      blurb: `What ${year} looks like here: a typical day, class sizes, how we settle new children and what to expect in the first term.`,
    });
  } else {
    chapters.push({
      title: `${stage.label}: your route from ${school.short}`,
      blurb: `${school.short} runs to age ${school.ages[1]}. This chapter maps the guided progression to ${
        school.progression ?? "our Nairobi schools"
      }, with the same pastoral team walking alongside you.`,
      note: "Transition planning included",
    });
  }

  for (const id of interests) {
    const interest = INTERESTS.find((i) => i.id === id);
    if (!interest) continue;
    switch (id) {
      case "boarding":
        chapters.push(
          school.boarding
            ? {
                title: `Boarding life at ${school.short}`,
                blurb: "Houses and houseparents, weekly and full boarding, weekend programmes and how we keep families close.",
              }
            : {
                title: `Boarding options near ${school.short}`,
                blurb: `${school.short} is a day school, so this chapter introduces boarding at ${
                  boardingNearby[school.code]
                } and how families combine day and boarding across the Group.`,
                note: "Smart suggestion",
              },
        );
        break;
      case "sport":
        chapters.push({
          title: `Sport at ${school.short}`,
          blurb: "The fixtures calendar, swimming and athletics, and how every child, not just the first team, finds their sport.",
        });
        break;
      case "arts":
        chapters.push({
          title: "Performing arts",
          blurb: `Music, drama and dance, from Early Years rhythm sessions to the ${stage.label} production.`,
        });
        break;
      case "stem":
        chapters.push({
          title: "STEM & innovation",
          blurb: `Labs, coding and robotics clubs, design technology and the ${stage.label} science pathway.`,
        });
        break;
      case "outdoor":
        chapters.push({
          title: "Learning outdoors",
          blurb: `Beyond the classroom: our ${school.motif.toLowerCase()} setting, forest school, expeditions and conservation partners.`,
        });
        break;
      case "university":
        chapters.push({
          title: "University guidance & destinations",
          blurb:
            stage.id === "secondary" || stage.id === "sixth"
              ? "Where recent leavers have gone, how guidance starts in Year 9 and the support behind every application."
              : "How the journey to university quietly begins in Primary, and what Sixth Form looks like across the Group.",
        });
        break;
      case "support":
        chapters.push({
          title: "Learning support & inclusion",
          blurb: "Our inclusion team, EAL provision, individual learning plans and how we partner with families.",
        });
        break;
      case "languages":
        chapters.push({
          title: "Languages & culture",
          blurb: `Kiswahili, French${school.code === "RW" ? " and Kinyarwanda" : ""} in the curriculum, and how 60+ nationalities celebrate together.`,
        });
        break;
      default:
        chapters.push({ title: interest.label, blurb: interest.blurb });
    }
  }

  chapters.push({
    title: "Fees & practicalities",
    blurb: `Indicative ${stage.label} fees from ${school.feeFrom} (${school.currency}), transport routes, uniform and what is included.`,
  });
  chapters.push({
    title: "Your next steps",
    blurb: `Visit dates this term, how to apply, and a direct line to ${school.contact.name}, ${school.contact.role}.`,
  });

  return chapters;
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there";

export const defaultSchool = SCHOOLS[0];
