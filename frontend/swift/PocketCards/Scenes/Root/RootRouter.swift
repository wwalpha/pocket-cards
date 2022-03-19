//
//  RootRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class RootRouter {
    func makeLanguageStudyiew() -> some View {
        return DailyStudyView(subject: SUBJECT.LANGUAGE).configureView()
    }

    func makeLanguageTestView() -> some View {
        return DailyTestView(subject: SUBJECT.LANGUAGE).configureView()
    }

    func makeScienceStudyiew() -> some View {
        return DailyStudyView(subject: SUBJECT.SCIENCE).configureView()
    }

    func makeScienceTestView() -> some View {
        return DailyTestView(subject: SUBJECT.SCIENCE).configureView()
    }

    func makeSocietyStudyiew() -> some View {
        return DailyStudyView(subject: SUBJECT.SOCIETY).configureView()
    }

    func makeSocietyTestView() -> some View {
        return DailyTestView(subject: SUBJECT.SOCIETY).configureView()
    }
}
