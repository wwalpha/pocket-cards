//
//  RootRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class RootRouter {

    func makeLanguageStudyiew() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_PRACTICE, subject: SUBJECT.LANGUAGE, mode: MODE.PRACTICE)
    }

    func makeLanguageTestView() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_EXAM, subject: SUBJECT.LANGUAGE, mode: MODE.EXAM)
    }

    func makeScienceStudyiew() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_PRACTICE, subject: SUBJECT.SCIENCE, mode: MODE.PRACTICE)
    }

    func makeScienceTestView() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_EXAM, subject: SUBJECT.SCIENCE, mode: MODE.EXAM)
    }

    func makeSocietyStudyiew() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_PRACTICE, subject: SUBJECT.SOCIETY, mode: MODE.PRACTICE)
    }

    func makeSocietyTestView() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_EXAM, subject: SUBJECT.SOCIETY, mode: MODE.EXAM)
    }

    func makeScienceWeeklyTestView() -> some View {
        WeeklyTestView().configureView(subject: SUBJECT.SCIENCE)
    }

    func makeSocietyWeeklyTestView() -> some View {
        WeeklyTestView().configureView(subject: SUBJECT.SOCIETY)
    }
}
