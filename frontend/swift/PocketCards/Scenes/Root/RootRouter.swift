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
        DailyStudyView().configureView(subject: SUBJECT.LANGUAGE, loadUrl: URLs.STUDY_DAILY_PRACTICE)
    }

    func makeLanguageTestView() -> some View {
        DailyTestView().configureView(subject: SUBJECT.LANGUAGE, loadUrl: URLs.STUDY_DAILY_TEST)
    }

    func makeScienceStudyiew() -> some View {
        DailyStudyView().configureView(subject: SUBJECT.SCIENCE, loadUrl: URLs.STUDY_DAILY_PRACTICE)
    }

    func makeScienceTestView() -> some View {
        DailyTestView().configureView(subject: SUBJECT.SCIENCE, loadUrl: URLs.STUDY_DAILY_TEST)
    }

    func makeSocietyStudyiew() -> some View {
        DailyStudyView().configureView(subject: SUBJECT.SOCIETY, loadUrl: URLs.STUDY_DAILY_PRACTICE)
    }

    func makeSocietyTestView() -> some View {
        DailyTestView().configureView(subject: SUBJECT.SOCIETY, loadUrl: URLs.STUDY_DAILY_TEST)
    }

    func makeScienceWeeklyTestView() -> some View {
        WeeklyRootView().configureView(subject: SUBJECT.SCIENCE)
    }

    func makeSocietyWeeklyTestView() -> some View {
        WeeklyRootView().configureView(subject: SUBJECT.SOCIETY)
    }
}
