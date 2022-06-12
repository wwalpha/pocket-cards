//
//  RootRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class RootRouter {
    func makeMathsTestView() -> some View {
        DailyTestView().configureView(subject: SUBJECT.MATHS)
    }

    func makeMathsReviewView() -> some View {
        DailyReviewView().configureView(subject: SUBJECT.MATHS)
    }

    func makeLanguageStudyiew() -> some View {
        DailyStudyView().configureView(subject: SUBJECT.LANGUAGE)
    }

    func makeLanguageTestView() -> some View {
        DailyTestView().configureView(subject: SUBJECT.LANGUAGE)
    }

    func makeScienceStudyiew() -> some View {
        DailyStudyView().configureView(subject: SUBJECT.SCIENCE)
    }

    func makeScienceTestView() -> some View {
        DailyTestView().configureView(subject: SUBJECT.SCIENCE)
    }

    func makeSocietyStudyiew() -> some View {
        DailyStudyView().configureView(subject: SUBJECT.SOCIETY)
    }

    func makeSocietyTestView() -> some View {
        DailyTestView().configureView(subject: SUBJECT.SOCIETY)
    }

    func makeScienceWeeklyTestView() -> some View {
        WeeklyRootView().configureView(subject: SUBJECT.SCIENCE)
    }

    func makeSocietyWeeklyTestView() -> some View {
        WeeklyRootView().configureView(subject: SUBJECT.SOCIETY)
    }
}
