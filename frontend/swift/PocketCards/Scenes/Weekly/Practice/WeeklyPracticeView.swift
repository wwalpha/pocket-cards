//
//  WeeklyPracticeView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//
//

import SwiftUI

struct WeeklyPracticeView: View {
    var interactor: WeeklyPracticeBusinessLogic?

    @ObservedObject var viewModel = WeeklyPracticeViewModel()

    var body: some View {
        if viewModel.isLoading {
            Text("Loading....")
                .onAppear {
                    interactor?.loadQuestions()
                }
        } else if viewModel.isFinish {
            Text("学習は終わりました")
                .font(.system(size: 64, design: .default))
        } else {
            FlashCard(question: viewModel.question!, action: interactor!.onAction)
//            FlashCard(
//                question: viewModel.title,
//                answer: viewModel.answer,
//                action: interactor!.onAction,
//                onPlay: interactor!.onPlay
//            )
        }
    }
}

extension WeeklyPracticeView: WeeklyPracticeDisplayLogic {
    func showNext(model: WeeklyPracticeViewModel) {
        viewModel.question = model.question
        viewModel.isLoading = model.isLoading
        viewModel.isFinish = model.isFinish
    }
}

extension WeeklyPracticeView {
    func configureView(subject: String) -> some View {
        var view = self
        let interactor = WeeklyPracticeInteractor(subject: subject)
        let presenter = WeeklyPracticePresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        view.viewModel.subject = subject

        return view
    }
}

struct WeeklyPracticeView_Previews: PreviewProvider {
    static var previews: some View {
        WeeklyPracticeView()
    }
}
