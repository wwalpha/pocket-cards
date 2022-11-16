//
//  RootRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class RootRouter {
    func makeMathsTestView() -> some View {
        DailyTestView().configureView(subject: SUBJECT.MATHS, loadUrl: URLs.STUDY_DAILY_PRACTICE)
    }

    func makeMathsReviewView() -> some View {
        DailyReviewView().configureView(subject: SUBJECT.MATHS)
    }

    func makeMathsWeeklyTestView() -> some View {
        DailyTestView().configureView(subject: SUBJECT.MATHS, loadUrl: URLs.STUDY_DAILY_CURRICULUM_ORDER)
    }

    func makeLanguageStudyiew() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_PRACTICE, subject: SUBJECT.LANGUAGE)
    }

    func makeLanguageTestView() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_EXAM, subject: SUBJECT.LANGUAGE)
    }

    func makeScienceStudyiew() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_PRACTICE, subject: SUBJECT.SCIENCE)
    }

    func makeScienceTestView() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_EXAM, subject: SUBJECT.SCIENCE)
    }

    func makeSocietyStudyiew() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_PRACTICE, subject: SUBJECT.SOCIETY)
    }

    func makeSocietyTestView() -> some View {
        DailyPracticeView().configureView(loadUrl: URLs.STUDY_DAILY_EXAM, subject: SUBJECT.SOCIETY)
    }

    func makeScienceWeeklyTestView() -> some View {
        WeeklyTestView().configureView(subject: SUBJECT.SCIENCE)
    }

    func makeSocietyWeeklyTestView() -> some View {
        WeeklyTestView().configureView(subject: SUBJECT.SOCIETY)
    }
}
