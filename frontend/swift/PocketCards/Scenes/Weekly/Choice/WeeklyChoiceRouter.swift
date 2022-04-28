//
//  WeeklyChoiceRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/04/26.
//

import SwiftUI

class WeeklyChoiceRouter {
    func makeTest(subject _: String) -> some View {
        WeeklyTestView().configureView(groupIds: ["123"])
    }

    func makePractice(subject: String) -> some View {
        WeeklyPracticeView().configureView(subject: subject)
    }
}
