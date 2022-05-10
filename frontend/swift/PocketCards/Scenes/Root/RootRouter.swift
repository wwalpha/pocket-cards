//
//  RootRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class RootRouter {
    func makeLanguageStudyiew() -> some View {
        DailyStudyView().configureView(subject: SUBJECT.LANGUAGE)
    }

    func makeLanguageTestView() -> some View {
        DailyTestView(subject: SUBJECT.LANGUAGE).configureView()
    }

    func makeScienceStudyiew() -> some View {
        DailyStudyView().configureView(subject: SUBJECT.SCIENCE)
    }

    func makeScienceTestView() -> some View {
        DailyTestView(subject: SUBJECT.SCIENCE).configureView()
    }

    func makeSocietyStudyiew() -> some View {
        DailyStudyView().configureView(subject: SUBJECT.SOCIETY)
    }

    func makeSocietyTestView() -> some View {
        DailyTestView(subject: SUBJECT.SOCIETY).configureView()
    }

    func makeScienceWeeklyTestView() -> some View {
        WeeklyRootView().configureView(subject: SUBJECT.SCIENCE)
    }

    func makeSocietyWeeklyTestView() -> some View {
        WeeklyRootView().configureView(subject: SUBJECT.SOCIETY)
    }
}
