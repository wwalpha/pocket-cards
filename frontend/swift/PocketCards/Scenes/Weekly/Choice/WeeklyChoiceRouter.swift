//
//  WeeklyChoiceRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/04/26.
//

import SwiftUI

class WeeklyChoiceRouter {
    func makeTest(selected: [Curriculum]) -> some View {
        WeeklyTestView().configureView(selected: selected)
    }

    func makePractice(groupIds: Set<String>) -> some View {
        WeeklyPracticeView().configureView(groupId: Array(groupIds)[0])
    }
}
